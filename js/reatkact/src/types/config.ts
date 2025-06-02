import { FontType, TextButtonNode, TextNode } from "./bridge";

export type Definitive<T> = { [P in keyof T]-?: T[P] };

export type PropsBase = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

// `props` is used by react
// `bridgeProps` is an extra overlay for types that need to be mapped manually (like enums)
// set `children` to `true` to auto add the children prop to the types
export type Nodes = {
  atkText: {
    props: PropsBase & {
      font?: keyof typeof FontType;
      fontSize?: number;
    };
    bridgeProps: {
      font: FontType;
    };
    bridgeNode: TextNode;
    children: true;
  };

  atkTextButton: {
    props?: PropsBase;
    bridgeNode: TextButtonNode;
    children: true;
  };
};

export type Node = keyof Nodes;

export type NodeBridgeType<T extends Node> = Nodes[T]["bridgeNode"];
export type NodeReactProps<T extends Node> =
  & Nodes[T]["props"]
  & (Nodes[T] extends { children: true } ? React.PropsWithChildren : {})
  & { ref?: React.Ref<NodeBridgeType<T>> };

export type NodeBridgeProps<T extends Node> =
  & Definitive<
    ("bridgeProps" extends keyof Nodes[T] ? (
        & Omit<Nodes[T]["props"], keyof Nodes[T]["bridgeProps"]>
        & Nodes[T]["bridgeProps"]
      )
      : Nodes[T]["props"])
  >
  & (Nodes[T] extends { children: true } ? {
      children: string;
    }
    : {});

export type AtkIntrinsicElements = {
  [P in Node]: NodeReactProps<P>;
};
