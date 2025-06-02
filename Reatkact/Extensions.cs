using Dalamud.Game.Text.SeStringHandling;
using Lumina.Text.ReadOnly;

namespace Reatkact;

public static class Extensions {
    public static SeString ParseMacroString(this string? str) {
        if (str is null) return SeString.Empty;
        var lumina = ReadOnlySeString.FromMacroString(str);
        return SeString.Parse(lumina.Data.Span);
    }
}
