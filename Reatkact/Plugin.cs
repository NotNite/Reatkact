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
        var platform = NodeRuntime.GetPlatform(this.configuration);

        // FIXME: lol
        var pluginDir = Services.PluginInterface.AssemblyLocation.DirectoryName!;
        var dir = Path.Combine(
            pluginDir,
            "..", // Debug
            "..", // bin
            "..", // Reatkact
            "js",
            "hello-world",
            "dist"
        );

        this.runtime = new NodeRuntime(platform, dir);
        this.runtime.Start();
    }

    public void Dispose() {
        this.runtime.Dispose();
        Services.NativeController.Dispose();
    }
}
