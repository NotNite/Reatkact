using System;
using Dalamud.Configuration;
using Newtonsoft.Json;

namespace Reatkact;

[Serializable]
public class Configuration : IPluginConfiguration {
    public int Version { get; set; } = 0;

    [JsonProperty] public NodeContext? Context;

    public void Save() {
        Services.PluginInterface.SavePluginConfig(this);
    }

    public record NodeContext {
        [JsonProperty] public nint Handle;
        [JsonProperty] public int ProcessId;
        [JsonProperty] public long ProcessTime;
    }
}
