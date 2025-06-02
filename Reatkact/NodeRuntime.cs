using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.CompilerServices;
using FFXIVClientStructs.FFXIV.Component.GUI;
using Microsoft.JavaScript.NodeApi;
using Microsoft.JavaScript.NodeApi.DotNetHost;
using Microsoft.JavaScript.NodeApi.Runtime;
using Reatkact.Bridge;

namespace Reatkact;

public class NodeRuntime : IDisposable {
    private readonly NodeEmbeddingThreadRuntime node;
    private JSReference? unmount;

    public NodeRuntime(NodeEmbeddingPlatform platform, string dir) {
        this.node = platform.CreateThreadRuntime(dir, new NodeEmbeddingRuntimeSettings() {
            MainScript =
                "globalThis.require = require('module').createRequire(process.execPath);\n"
        });

        // Setup marshaling for our classes
        this.node.Run(() => {
            try {
                var marshaller = new JSMarshaller {
                    AutoCamelCase = true
                };
                var exporter = new TypeExporter(marshaller);

                // enums
                RegisterClass<FontType>(false);

                // structs
                RegisterClass<BridgeVector2>(false);
                RegisterClass<BridgeAddon.AddonOptions>(false);
                RegisterClass<BridgeTextNode.TextNodeProps>(false);
                RegisterClass<BridgeTextButtonNode.TextButtonNodeProps>(false);

                // classes
                RegisterClass<BridgeAddon>();
                RegisterClass<BridgeTextNode>();
                RegisterClass<BridgeTextButtonNode>();
                return;

                void RegisterClassType(Type type, bool ctor = true) {
                    var obj = exporter.ExportType(type);
                    if (ctor) JSValue.Global.SetProperty(type.Name, obj.GetValue());
                }

                void RegisterClass<T>(bool ctor = true) where T : notnull => RegisterClassType(typeof(T), ctor);
            } catch (Exception e) {
                Services.PluginLog.Error(e, "Failed to register types");
            }
        });
    }

    // Since this can only be created once per process, we need to reuse the same pointer across plugin reloads
    // Yes, this is terrible
    public static NodeEmbeddingPlatform GetPlatform(Configuration configuration) {
        var libnode = Path.Combine(
            Services.PluginInterface.AssemblyLocation.DirectoryName!,
            "runtimes",
            "win-x64",
            "native",
            "libnode.dll"
        );

        // Should be unique enough to determine when the game restarts
        var processTime = ((DateTimeOffset) Process.GetCurrentProcess().StartTime).ToUnixTimeSeconds();

        if (configuration.ContextHandle is { } existingHandle
            && existingHandle != nint.Zero
            && configuration.ContextProcessTime == processTime) {
            // Don't run the constructor, it'll create a second context!
            var type = typeof(NodeEmbeddingPlatform);
            var platform = (NodeEmbeddingPlatform) RuntimeHelpers.GetUninitializedObject(type);

            type.GetProperty("Current", BindingFlags.Static | BindingFlags.Public)!
                .SetValue(null, platform);

            NodeEmbedding.Initialize(libnode);

            var handle = new NodejsRuntime.node_embedding_platform(existingHandle);
            type.GetField("_platform", BindingFlags.Instance | BindingFlags.NonPublic)!
                .SetValue(platform, handle);

            return platform;
        } else {
            // Pray to god it doesn't crash I guess
            var platform = new NodeEmbeddingPlatform(new NodeEmbeddingPlatformSettings() {
                LibNodePath = libnode,
                Args = ["node", "--expose-gc"]
            });

            configuration.ContextHandle = platform.Handle.Handle;
            configuration.ContextProcessTime = processTime;
            configuration.Save();

            return platform;
        }
    }

    public void Start() {
        Services.PluginLog.Debug("Inspector started on {Uri}", this.node.StartInspector().ToString());

        this.node.Run(() => {
            try {
                var func = (this.node.Import("./index.js"))["default"].As<JSFunction>();
                if (func is null) throw new Exception("Failed to find init function");

                var result = func.Value.CallAsStatic().As<JSFunction>();
                if (result is null) throw new Exception("No unmount function returned");
                this.unmount = new JSReference(result.Value);
            } catch (Exception e) {
                Services.PluginLog.Error(e, "Failed to initialize");
            }
        });

        Services.PluginLog.Debug("Loaded!");
    }

    public void Dispose() {
        try {
            this.unmount?.Run((f) => f.AsUnchecked<JSFunction>().CallAsStatic());
        } catch (Exception e) {
            Services.PluginLog.Error(e, "Failed to call unmount, game will probably deadlock now lol");
        }

        this.node.StopInspector();
        this.node.GC();
        this.node.Dispose();
    }
}
