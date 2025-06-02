export enum FontType {
  Axis = 0,
  MiedingerMed = 1,
  Miedinger = 2,
  TrumpGothic = 3,
  Jupiter = 4,
  JupiterLarge = 5
}

interface IBridgeNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface INodeControls {
  AppendNodeRaw(child: IBridgeNode): void;
  InsertBeforeRaw(child: IBridgeNode, before: IBridgeNode): void;
  RemoveChildRaw(child: IBridgeNode): void;
}

// Addon stuff
export interface AddonOptions {
  title: string;
  width: number;
  height: number;
}

export interface BridgeAddon extends INodeControls {
  Open(): void;
  Close(): void;
}

export interface BridgeNodeBase extends IBridgeNode, INodeControls {}

// Nodes
export interface TextNode extends BridgeNodeBase {
  fontType: FontType;
  fontSize: number;
  text: string;
}

export interface TextButtonNode extends BridgeNodeBase {
  text: string;
}

type NodeConstructor<T> = { new(): T };
export interface ReatkactBridge {
  TextNode: NodeConstructor<TextNode>;
  TextButtonNode: NodeConstructor<TextButtonNode>;

  BridgeAddon: { new(opts: AddonOptions): BridgeAddon };
}
