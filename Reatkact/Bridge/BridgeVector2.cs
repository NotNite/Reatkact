using System.Numerics;

namespace Reatkact.Bridge;

// ReSharper disable InconsistentNaming this marshal some ass
public record struct BridgeVector2 {
    public float x { get; set; }
    public float y { get; set; }

    public static implicit operator Vector2(BridgeVector2 v) => new(v.x, v.y);
    public static implicit operator BridgeVector2(Vector2 v) => new() { x = v.X, y = v.Y };
}
