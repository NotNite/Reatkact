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
using Reatkact.Bridge.Nodes;

namespace Reatkact;

public class NodeRuntime : IDisposable {
    private readonly NodeEmbeddingThreadRuntime node;
    private JSReference? unload;

    public NodeRuntime(
        Configuration configuration,
        string? baseDir = null
    ) {
        var platform = GetPlatform(configuration);
        this.node = platform.CreateThreadRuntime(baseDir, new NodeEmbeddingRuntimeSettings() {
            MainScript =
                "globalThis.require = require('module').createRequire(process.execPath);\n"
        });

        // Setup marshalling for our classes
        this.node.Run(() => {
            try {
                this.BindTypes();
            } catch (Exception e) {
                Services.PluginLog.Error(e, "Failed to bind types");
            }
        });
    }

    private void BindTypes() {
        // This is unfortunately done by hand with reflection, the source generator is only for native addons
        var marshaller = new JSMarshaller {
            AutoCamelCase = true
        };
        var exporter = new TypeExporter(marshaller);
        var bridge = new JSObject();

        // Enums
        RegisterType(typeof(FontType), define: false);

        // Structs
        RegisterType(typeof(BridgeAddon.AddonOptions), define: false);

        // Classes
        RegisterType(typeof(BridgeAddon));
        RegisterType(typeof(TextNode));
        RegisterType(typeof(TextButtonNode));

        JSValue.Global.SetProperty("ReatkactBridge", bridge);
        return;

        void RegisterType(Type type, bool define = true, string? name = null) {
            var value = exporter.ExportType(type);
            if (define) bridge[name ?? type.Name] = value.GetValue();
        }
    }

    // Since this can only be created once per process, we need to reuse the same pointer across plugin reloads
    // Yes, this is terrible
    private static NodeEmbeddingPlatform GetPlatform(Configuration configuration) {
        var libnode = Path.Combine(
            Services.PluginInterface.AssemblyLocation.DirectoryName!,
            "runtimes",
            "win-x64",
            "native",
            "libnode.dll"
        );

        // Should be unique enough to determine when the game restarts
        var process = Process.GetCurrentProcess();
        var processId = process.Id;
        var processTime = ((DateTimeOffset) Process.GetCurrentProcess().StartTime).ToUnixTimeSeconds();

        if (configuration.Context is { } context
            && context.Handle != nint.Zero
            && context.ProcessId == processId
            && context.ProcessTime == processTime) {
            // Don't run the constructor, it'll create a second context!
            var type = typeof(NodeEmbeddingPlatform);
            var platform = (NodeEmbeddingPlatform) RuntimeHelpers.GetUninitializedObject(type);

            type.GetProperty("Current", BindingFlags.Static | BindingFlags.Public)!
                .SetValue(null, platform);

            NodeEmbedding.Initialize(libnode);

            var handle = new NodejsRuntime.node_embedding_platform(context.Handle);
            type.GetField("_platform", BindingFlags.Instance | BindingFlags.NonPublic)!
                .SetValue(platform, handle);

            return platform;
        } else {
            // Pray to god it doesn't crash I guess
            var platform = new NodeEmbeddingPlatform(new NodeEmbeddingPlatformSettings() {
                LibNodePath = libnode,
                Args = ["node", "--expose-gc"]
            });

            configuration.Context = new Configuration.NodeContext() {
                Handle = platform.Handle.Handle,
                ProcessId = processId,
                ProcessTime = processTime
            };
            configuration.Save();

            return platform;
        }
    }

    // TODO: hot reloading?
    public void Start(string file) {
        Services.PluginLog.Debug("Inspector started on {Uri}", this.node.StartInspector().ToString());

        this.node.Run(() => {
            try {
                var module = this.node.Import(file);

                var init = module.GetProperty("default").As<JSFunction>();
                if (init is null) throw new Exception("Failed to find init function");

                var unloadFunc = init.Value.CallAsStatic().As<JSFunction>();
                if (unloadFunc is null) throw new Exception("No unload function returned - bad things will happen!");

                this.unload = new JSReference(unloadFunc.Value);
            } catch (Exception e) {
                Services.PluginLog.Error(e, "Failed to initialize");
            }
        });

        Services.PluginLog.Debug("Loaded!");
    }

    public void Dispose() {
        // This unload function is important, because without it, the React renderer is still doing things
        // This hangs/crashes if we unload while that happens, presumably since it can't GC the created classes
        try {
            this.unload?.Run((f) => f.AsUnchecked<JSFunction>().CallAsStatic());
        } catch (Exception e) {
            Services.PluginLog.Error(e, "Failed to call unmount, game will probably deadlock now lol");
        }

        this.node.StopInspector();
        this.node.GC();
        this.node.Dispose();
    }
}
