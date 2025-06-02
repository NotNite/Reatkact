using System;
using Dalamud.Configuration;
using Newtonsoft.Json;

namespace Reatkact;

[Serializable]
public class Configuration : IPluginConfiguration {
    public int Version { get; set; } = 0;

    [JsonProperty] public nint? ContextHandle;
    [JsonProperty] public long? ContextProcessTime;

    public void Save() {
        Services.PluginInterface.SavePluginConfig(this);
    }
}
