using System;
using System.Diagnostics.CodeAnalysis;
using System.Numerics;
using KamiToolKit.Addon;

namespace Reatkact.Bridge;

public class BridgeAddon(BridgeAddon.AddonOptions options) : NodeControlsBase, IDisposable {
    // Separate class to not expose the inherited properties to JS
    private readonly DynamicAddon addon = new(options);

    public void Open() => this.addon.Open();
    public void Close() => this.addon.Close();
    public override void AppendNode(IBridgeNode child) => this.addon.AppendNode(child);
    public override void InsertBefore(IBridgeNode child, IBridgeNode before) => this.addon.InsertBefore(child, before);
    public override void RemoveChild(IBridgeNode child) => this.addon.RemoveChild(child);

    public void Dispose() {
        // FIXME this isn't actually called anywhere lol
        this.addon.Dispose();
    }

    private class DynamicAddon : NativeAddon, INodeControls {
        [SetsRequiredMembers]
        public DynamicAddon(AddonOptions options) {
            this.NativeController = Services.NativeController;
            this.InternalName = "Reatkact"; // FIXME this must be unique
            this.Title = options.Title;
            this.Size = new Vector2(options.Width, options.Height);
        }

        public void AppendNode(IBridgeNode child) {
            NodeIdCounter.EnsureNodeId(child);
            this.NativeController.AttachToAddon(child.Node, this);
        }

        public void InsertBefore(IBridgeNode child, IBridgeNode before) {
            NodeIdCounter.EnsureNodeId(child);
            NodeIdCounter.EnsureNodeId(before);
            this.NativeController.AttachToAddon(child.Node, this); // FIXME
        }

        public void RemoveChild(IBridgeNode child) {
            this.NativeController.DetachNode(child.Node);
        }
    }

    public struct AddonOptions {
        public required string Title { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
    }
}
