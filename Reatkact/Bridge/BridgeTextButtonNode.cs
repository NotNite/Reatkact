using System.Numerics;
using KamiToolKit.Nodes.ComponentNodes;

namespace Reatkact.Bridge;

public class BridgeTextButtonNode() : BridgeElement<TextButtonNode, BridgeTextButtonNode.TextButtonNodeProps>(new TextButtonNode()) {
    private TextButtonNodeProps? lastProps;

    public override void ApplyProps(TextButtonNodeProps rawProps) {
        var props = rawProps with {
            Position = rawProps.Position ?? TextButtonNodeProps.DefaultPosition,
            Size = rawProps.Size ?? TextButtonNodeProps.DefaultSize
        };

        if (props.Position != this.lastProps?.Position) this.Node.Position = props.Position!.Value;
        if (props.Size != this.lastProps?.Size) this.Node.Size = props.Size!.Value;
        if (props.Children != this.lastProps?.Children) this.Node.Label = props.Children.ParseMacroString();

        this.lastProps = props;
    }

    public record struct TextButtonNodeProps : IPropsBase {
        public static readonly BridgeVector2 DefaultPosition = Vector2.Zero;
        public static readonly BridgeVector2 DefaultSize = new Vector2(100, 28);

        public string? Children { get; set; }

        public BridgeVector2? Position { get; set; }
        public BridgeVector2? Size { get; set; }
    }
}
