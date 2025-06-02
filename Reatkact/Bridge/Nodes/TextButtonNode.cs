using KTKNode = KamiToolKit.Nodes.ComponentNodes.TextButtonNode;

namespace Reatkact.Bridge.Nodes;

public class TextButtonNode() : BridgeNodeBase<KTKNode>() {
    // ReSharper disable InconsistentNaming
    public string text {
        get => this.Node.Label.ToMacroString();
        set => this.Node.Label = value.ParseMacroString();
    }
    // ReSharper restore InconsistentNaming
}
