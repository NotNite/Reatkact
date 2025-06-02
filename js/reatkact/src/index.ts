import "./types/global";

import ReactReconciler from "react-reconciler";
import { ConcurrentRoot } from "react-reconciler/constants";
import reconciler from "./reconciler";
import type { Reatkact } from "./types/react";

const Reatkact: Reatkact = {
  createContainer(opts) {
    return { type: "addon", obj: new ReatkactBridge.BridgeAddon(opts) };
  },

  createRoot(container) {
    const fiber: ReactReconciler.OpaqueRoot = (reconciler as any).createContainer(
      container,
      ConcurrentRoot,
      null,
      false,
      null,
      "",
      console.error,
      console.error,
      console.error,
      null
    );

    return {
      render(children) {
        container.obj.Open(); // TODO: bad spot?
        reconciler.updateContainer(children, fiber);
      },

      unmount() {
        reconciler.updateContainer(null, fiber);
      }
    };
  },

  run(children, opts) {
    return () => {
      try {
        const container = this.createContainer(opts);
        const root = this.createRoot(container);
        root.render(children);
        return () => {
          try {
            root.unmount();
          } catch (e) {
            console.error(e);
          }
        };
      } catch (e) {
        console.error(e);
        return () => {};
      }
    };
  }
};

export default Reatkact;
export { TextButtonNode, TextNode } from "./types/bridge";
export { Reatkact, ReatkactContainer, ReatkactRoot } from "./types/react";
