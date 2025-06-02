using System.Threading;
using KamiToolKit.System;

namespace Reatkact.Bridge;

// This might be the dumbest hack I've ever made
public static class NodeIdCounter {
    private static uint NodeId;

    public static void EnsureNodeId(NodeBase node) {
        if (node.NodeId == 0) node.NodeId = Interlocked.Increment(ref NodeId);
    }

    public static void EnsureNodeId(IBridgeElement element) => EnsureNodeId(element.Node);
}
