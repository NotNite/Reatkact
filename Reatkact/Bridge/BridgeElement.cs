using System;
using KamiToolKit.Classes;
using KamiToolKit.System;

namespace Reatkact.Bridge;

public interface IBridgeElement : IDisposable {
    internal NodeBase Node { get; }

    public void AppendNode(IBridgeElement child) {
        Services.PluginLog.Debug("IBridgeElement#AppendNode {This} {Child}", this, child);
        NodeIdCounter.EnsureNodeId(child);
        Services.NativeController.AttachToNode(this.Node, child.Node, NodePosition.AsLastChild);
    }

    public void InsertBefore(IBridgeElement child, IBridgeElement before) {
        Services.PluginLog.Debug("IBridgeElement#InsertBefore {This} {Child} {Before}", this, child, before);
        NodeIdCounter.EnsureNodeId(child);
        NodeIdCounter.EnsureNodeId(before);
        Services.NativeController.AttachToNode(this.Node, before.Node, NodePosition.BeforeTarget);
    }

    public void RemoveChild(IBridgeElement child) {
        Services.PluginLog.Debug("IBridgeElement#RemoveChild {This} {Child}", this, child);
        Services.NativeController.DetachNode(child.Node);
    }

    void IDisposable.Dispose() {
        this.Node.Dispose();
    }
}

public abstract class BridgeElement<TN, TP> : IBridgeElement
    where TN : NodeBase
    where TP : IPropsBase {
    internal readonly TN Node;
    NodeBase IBridgeElement.Node => this.Node;

    protected BridgeElement(TN node) {
        this.Node = node;
        this.Node.IsVisible = true;
    }

    public abstract void ApplyProps(TP props);
}
