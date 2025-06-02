using Dalamud.Game.Text.SeStringHandling;
using Lumina.Text.ReadOnly;

namespace Reatkact.Bridge;

// Helpers to turn macro strings into Dalamud's (deprecated?) SeString object
public static class SeStringExtensions {
    public static SeString ParseMacroString(this string? str) {
        if (str is null) return SeString.Empty;
        var lumina = ReadOnlySeString.FromMacroString(str);
        return SeString.Parse(lumina.Data.Span);
    }

    public static string ToMacroString(this SeString? str) {
        if (str is null) return string.Empty;
        var lumina = new ReadOnlySeString(str.Encode());
        return lumina.ToString();
    }
}
