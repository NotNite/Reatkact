using System.Threading;
using KamiToolKit.System;

namespace Reatkact.Bridge;

// Dumb hack to make sure elements always have unique IDs
// FIXME FIXME FIXME FIXME FIXME
public static class NodeIdCounter {
    private static uint NodeId;

    public static void EnsureNodeId(NodeBase node) {
        if (node.NodeId == 0) node.NodeId = Interlocked.Increment(ref NodeId);
    }

    public static void EnsureNodeId(IBridgeNode node) => EnsureNodeId(node.Node);
}
