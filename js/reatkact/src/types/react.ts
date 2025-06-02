import { AddonOptions, BridgeAddon } from "./bridge";
import { Node, NodeBridgeProps, NodeBridgeType, NodeReactProps } from "./config";

export interface ReatkactRoot {
  render(children: React.ReactNode): void;
  unmount(): void;
}

export interface Reatkact {
  createContainer(opts: AddonOptions): ReatkactContainer;
  createRoot(container: ReatkactContainer): ReatkactRoot;
  run(children: React.ReactNode, opts: AddonOptions): () => () => void; // Shorthand to setup the unload function
}

// Other stuff
export type ReatkactType = Node;
export type ReatkactContainer = { type: "addon"; obj: BridgeAddon };
export type ReatkactProps = NodeReactProps<ReatkactType>; // this isn't really used anywhere, there's already strong typing where it matters

export interface ReatkactInstance<T extends ReatkactType> {
  type: "instance";
  obj: NodeBridgeType<T>;

  // TODO: maybe not clone an object like this every render lol
  convertProps(props: NodeReactProps<T>): NodeBridgeProps<T>;
  applyProps(
    nextProps: NodeBridgeProps<T>,
    prevProps?: NodeBridgeProps<T>
  ): void;
}

export type ReatkactTextInstance = { type: "text"; obj: string };
