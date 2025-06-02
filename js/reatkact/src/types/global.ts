import { AddonOptions, ElementControls } from "./bridge";
import { AtkElementInstance, AtkIntrinsicElements } from "./props";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends AtkIntrinsicElements {}
  }
}

declare global {
  export class BridgeAddon extends ElementControls {
    constructor(opts: AddonOptions);
    Open(): void;
    Close(): void;
  }

  const BridgeTextNode: typeof AtkElementInstance<"atkText">;
  const BridgeTextButtonNode: typeof AtkElementInstance<"atkTextButton">;
}

export {};
