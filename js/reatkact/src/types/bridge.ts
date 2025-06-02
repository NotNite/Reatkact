export interface Vector2 {
  x: number;
  y: number;
}

export interface AddonOptions {
  title: string;
  size?: Vector2;
}

export declare class ElementControls {
  AppendNode(child: BridgeElement): void;
  InsertBefore(child: BridgeElement, before: BridgeElement): void;
  RemoveChild(child: BridgeElement): void;
}

export declare class BridgeElement<P = any> extends ElementControls {
  constructor();
  ApplyProps(props: P): void;
}
