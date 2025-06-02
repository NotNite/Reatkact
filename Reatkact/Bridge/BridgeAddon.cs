using System;
using System.Numerics;
using FFXIVClientStructs.FFXIV.Component.GUI;
using KamiToolKit.Addon;
using KamiToolKit.Nodes;

namespace Reatkact.Bridge;

public class BridgeAddon(BridgeAddon.AddonOptions options) : IDisposable {
    private readonly DynamicAddon addon = new() {
        NativeController = Services.NativeController,
        InternalName = "Reatkact", // FIXME
        Title = options.Title,
        Size = options.Size ?? AddonOptions.DefaultSize
    };

    public void Open() => this.addon.Open();
    public void Close() => this.addon.Close();

    // `object?` params are a dumb hack because it can't pick up the interface right
    public void AppendNode(object? rawChild) {
        if (rawChild is not IBridgeElement child) throw new Exception();

        Services.PluginLog.Debug("BridgeAddon#AppendNode {Addon} {Child}", this, child);
        NodeIdCounter.EnsureNodeId(child);
        Services.NativeController.AttachToAddon(
            child.Node,
            this.addon
        );
    }

    public void InsertBefore(object? rawChild, object? rawBefore) {
        if (rawChild is not IBridgeElement child) throw new Exception();
        if (rawBefore is not IBridgeElement before) throw new Exception();

        Services.PluginLog.Debug("BridgeAddon#InsertBefore {Addon} {Child} {Before}", this, child, before);
        NodeIdCounter.EnsureNodeId(child);
        NodeIdCounter.EnsureNodeId(before);

        // FIXME
        Services.NativeController.AttachToAddon(
            child.Node,
            this.addon
        );
    }

    public void RemoveChild(object? rawChild) {
        if (rawChild is not IBridgeElement child) throw new Exception();

        Services.PluginLog.Debug("BridgeAddon#RemoveChild {Addon} {Child}", this, child);
        Services.NativeController.DetachFromAddon(child.Node, this.addon);
    }

    // Separate class to not expose everything to JS
    private class DynamicAddon : NativeAddon {
        public readonly ResNode Node = new() {
            IsVisible = true
        };

        protected override unsafe void OnSetup(AtkUnitBase* addon) {
            NodeIdCounter.EnsureNodeId(this.Node);
            Services.NativeController.AttachToAddon(this.Node, this);
        }
    }

    public struct AddonOptions {
        public static readonly Vector2 DefaultSize = new(500, 500);

        public BridgeVector2? Size { get; set; }
        public required string Title { get; set; }
    }

    public void Dispose() {
        this.addon.Dispose();
    }
}
