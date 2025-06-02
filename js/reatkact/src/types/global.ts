import { ReatkactBridge } from "./bridge";
import { AtkIntrinsicElements } from "./config";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends AtkIntrinsicElements {}
  }
}

declare global {
  const ReatkactBridge: ReatkactBridge;
}

export {};
