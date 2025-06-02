import { AddonOptions } from "./bridge";
import { AtkElement, AtkElementInstance, AtkElementReactProps } from "./props";

export type ReatkactType = AtkElement;
export type ReatkactContainer = BridgeAddon;
export type ReatkactProps = Record<string, unknown>;

export interface ReatkactInstance<T extends ReatkactType> {
  instance: AtkElementInstance<T>;
  applyProps(props: AtkElementReactProps<T>): void;
}

export interface Root {
  render(children: React.ReactNode): () => void;
}

export interface Reatkact {
  createContainer(opts: AddonOptions): ReatkactContainer;
  createRoot(container: ReatkactContainer): Root;
}
