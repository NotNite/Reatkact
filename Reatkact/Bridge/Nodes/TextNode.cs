using FFXIVClientStructs.FFXIV.Component.GUI;
using KTKNode = KamiToolKit.Nodes.TextNode;

namespace Reatkact.Bridge.Nodes;

public class TextNode() : BridgeNodeBase<KTKNode> {
    // ReSharper disable InconsistentNaming
    public FontType fontType {
        get => this.Node.FontType;
        set => this.Node.FontType = value;
    }

    public uint fontSize {
        get => this.Node.FontSize;
        set => this.Node.FontSize = value;
    }

    public string text {
        get => this.Node.Text.ToMacroString();
        set => this.Node.Text = value.ParseMacroString();
    }
    // ReSharper restore InconsistentNaming
}
