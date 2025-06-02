using System;

namespace Reatkact.Bridge;

public interface INodeControls {
    protected void AppendNode(IBridgeNode child);
    protected void InsertBefore(IBridgeNode child, IBridgeNode before);
    protected void RemoveChild(IBridgeNode child);
}

public abstract class NodeControlsBase : INodeControls {
    // C# marshalling struggles with implemented interfaces
    public void AppendNodeRaw(object? rawChild) {
        if (rawChild is not IBridgeNode child) throw new ArgumentException("Invalid type", nameof(rawChild));
        this.AppendNode(child);
    }

    public void InsertBeforeRaw(object? rawChild, object? rawBefore) {
        if (rawChild is not IBridgeNode child) throw new ArgumentException("Invalid type", nameof(rawChild));
        if (rawBefore is not IBridgeNode before) throw new ArgumentException("Invalid type", nameof(rawBefore));
        this.InsertBefore(child, before);
    }

    public void RemoveChildRaw(object? rawChild) {
        if (rawChild is not IBridgeNode child) throw new ArgumentException("Invalid type", nameof(rawChild));
        this.RemoveChild(child);
    }

    public abstract void AppendNode(IBridgeNode child);
    public abstract void InsertBefore(IBridgeNode child, IBridgeNode before);
    public abstract void RemoveChild(IBridgeNode child);
}
