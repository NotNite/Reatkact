import { BridgeElement, Vector2 } from "./bridge";

export type StringifiedChildren = { children?: string };

export type PropsBase = {
  position?: Vector2;
  size?: Vector2;
};

export enum FontType {
  Axis = 0,
  MiedingerMed = 1,
  Miedinger = 2,
  TrumpGothic = 3,
  Jupiter = 4,
  JupiterLarge = 5
}

// `props` is used by react
// `bridgeProps` is an extra overlay for types that need to be mapped manually (like enums)
// set `children` to `true` to auto add the children prop to the types
export type AtkElements = {
  atkText: {
    props: PropsBase & {
      font?: keyof typeof FontType;
      fontSize?: number;
    };
    bridgeProps: {
      font?: FontType;
    };
    children: true;
  };

  atkTextButton: {
    props?: PropsBase;
    children: true;
  };
};

export type AtkElement = keyof AtkElements;

export type AtkElementReactProps<T extends AtkElement> =
  & AtkElements[T]["props"]
  & (AtkElements[T] extends { children: true } ? {
      children?: React.ReactNode;
    }
    : {});

export type AtkElementBridgeProps<T extends AtkElement> =
  & ("bridgeProps" extends keyof AtkElements[T] ? (
      & Omit<AtkElements[T]["props"], keyof AtkElements[T]["bridgeProps"]>
      & AtkElements[T]["bridgeProps"]
    )
    : AtkElements[T]["props"])
  & (AtkElements[T] extends { children: true } ? {
      children?: string;
    }
    : {});

export declare class AtkElementInstance<T extends AtkElement> extends BridgeElement<
  AtkElementBridgeProps<T>
> {
  constructor();
}

export type AtkIntrinsicElements = {
  [P in AtkElement]: AtkElementReactProps<P>;
};
