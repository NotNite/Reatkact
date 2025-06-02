using System;
using KamiToolKit.Classes;
using KamiToolKit.System;

namespace Reatkact.Bridge;

public interface IBridgeNode : IDisposable, INodeControls {
    internal NodeBase Node { get; }

    void IDisposable.Dispose() {
        this.Node.Dispose();
    }
}

public abstract class BridgeNodeBase<TN> : NodeControlsBase, IBridgeNode where TN : NodeBase, new() {
    internal readonly TN Node;
    NodeBase IBridgeNode.Node => this.Node;

    protected BridgeNodeBase() {
        this.Node = new TN();
        this.Node.IsVisible = true;
    }

    // ReSharper disable InconsistentNaming
    public float x {
        get => this.Node.X;
        set => this.Node.X = value;
    }

    public float y {
        get => this.Node.Y;
        set => this.Node.Y = value;
    }

    public float width {
        get => this.Node.Width;
        set => this.Node.Width = value;
    }

    public float height {
        get => this.Node.Height;
        set => this.Node.Height = value;
    }
    // ReSharper restore InconsistentNaming

    public override void AppendNode(IBridgeNode child) {
        NodeIdCounter.EnsureNodeId(child);
        Services.NativeController.AttachToNode(this.Node, child.Node, NodePosition.AsLastChild);
    }

    public override void InsertBefore(IBridgeNode child, IBridgeNode before) {
        NodeIdCounter.EnsureNodeId(child);
        NodeIdCounter.EnsureNodeId(before);
        Services.NativeController.AttachToNode(this.Node, before.Node, NodePosition.BeforeTarget);
    }

    public override void RemoveChild(IBridgeNode child) {
        Services.NativeController.DetachNode(child.Node);
    }
}
