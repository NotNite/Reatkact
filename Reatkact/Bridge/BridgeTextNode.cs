using System.Numerics;
using FFXIVClientStructs.FFXIV.Component.GUI;
using KamiToolKit.Nodes;

namespace Reatkact.Bridge;

public class BridgeTextNode() : BridgeElement<TextNode, BridgeTextNode.TextNodeProps>(new TextNode()) {
    private TextNodeProps? lastProps;

    public override void ApplyProps(TextNodeProps rawProps) {
        var props = rawProps with {
            Font = rawProps.Font ?? TextNodeProps.DefaultFont,
            FontSize = rawProps.FontSize ?? TextNodeProps.DefaultFontSize,
            Position = rawProps.Position ?? TextNodeProps.DefaultPosition,
            Size = rawProps.Size ?? TextNodeProps.DefaultSize
        };

        if (props.Font != this.lastProps?.Font) this.Node.FontType = props.Font.Value;
        if (props.FontSize != this.Node.FontSize) this.Node.FontSize = props.FontSize.Value;
        if (props.Position != this.lastProps?.Position) this.Node.Position = props.Position!.Value;
        if (props.Size != this.lastProps?.Size) this.Node.Size = props.Size!.Value;
        if (props.Children != this.lastProps?.Children) this.Node.Text = props.Children.ParseMacroString();

        this.lastProps = props;
    }

    public record struct TextNodeProps : IPropsBase {
        public static readonly FontType DefaultFont = FontType.Axis;
        public static readonly uint DefaultFontSize = 12;
        public static readonly BridgeVector2 DefaultPosition = Vector2.Zero;
        public static readonly BridgeVector2 DefaultSize = Vector2.Zero;

        public FontType? Font { get; set; }
        public uint? FontSize { get; set; }

        public string? Children { get; set; }

        public BridgeVector2? Position { get; set; }
        public BridgeVector2? Size { get; set; }
    }
}
