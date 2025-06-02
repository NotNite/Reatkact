import "./types/global";

import { ConcurrentRoot } from "react-reconciler/constants";
import createReconciler from "./reconciler";
import type { Reatkact } from "./types";

const Reatkact: Reatkact = {
  createContainer(opts) {
    return new BridgeAddon(opts);
  },

  createRoot(container) {
    const reconciler = createReconciler(container);

    return {
      render(children) {
        const fiber = (reconciler as any).createContainer(
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

        container.Open(); // TODO: bad spot?
        reconciler.updateContainer(children, fiber);

        return () => {
          reconciler.updateContainer(null, fiber);
        };
      }
    };
  }
};

export default Reatkact;
export * from "./types";
