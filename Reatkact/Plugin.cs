using System.IO;
using Dalamud.Plugin;
using KamiToolKit;

namespace Reatkact;

public sealed class Plugin : IDalamudPlugin {
    private readonly NodeRuntime runtime;
    private readonly Configuration configuration;

    public Plugin(IDalamudPluginInterface pluginInterface) {
        pluginInterface.Create<Services>();
        Services.NativeController = new NativeController(pluginInterface);

        this.configuration = Services.PluginInterface.GetPluginConfig() as Configuration ?? new Configuration();

        // FIXME: lol
        var pluginDir = Services.PluginInterface.AssemblyLocation.DirectoryName!;
        var file = Path.Combine(
            pluginDir,
            "..", // Debug
            "..", // bin
            "..", // Reatkact
            "js",
            "hello-world",
            "dist",
            "index.js"
        );

        this.runtime = new NodeRuntime(this.configuration, Path.GetDirectoryName(file));
        this.runtime.Start(file);
    }

    public void Dispose() {
        this.runtime.Dispose();
        Services.NativeController.Dispose();
    }
}
