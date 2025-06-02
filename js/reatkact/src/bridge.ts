import { BridgeNodeBase, FontType } from "./types/bridge";
import { Definitive, PropsBase } from "./types/config";
import { ReatkactInstance, ReatkactType } from "./types/react";

function getChildrenString(children?: React.ReactNode) {
  if (typeof children === "string") {
    return children.trim();
  } else if (Array.isArray(children)) {
    let str = "";
    for (const child of children) {
      const childStr = getChildrenString(child);
      if (childStr != null) str += childStr + " ";
    }
    return str.trim();
  } else {
    return undefined;
  }
}

function enumMap<T extends string>(
  map: Record<T, number>,
  value?: T
) {
  if (value == null) return value;
  const result = map[value];
  if (result != null) return result;
  throw new Error("Failed to map enum value: " + value);
}

function applyBaseProps(
  obj: BridgeNodeBase,
  nextProps: Definitive<PropsBase>,
  prevProps?: Definitive<PropsBase>
) {
  if (nextProps.x !== prevProps?.x) obj.x = nextProps.x;
  if (nextProps.y !== prevProps?.y) obj.y = nextProps.y;
  if (nextProps.width !== prevProps?.width) obj.width = nextProps.width;
  if (nextProps.height !== prevProps?.height) obj.height = nextProps.height;
}

export function createInstance<T extends ReatkactType>(type: T): ReatkactInstance<T> {
  const assertType = <TT extends ReatkactType>(obj: ReatkactInstance<TT>) => {
    // I don't know why this is needed. is my type broken? did I find a tsc bug? who knows!
    return obj as ReatkactInstance<T>;
  };

  switch (type) {
    case "atkText": {
      return assertType<"atkText">({
        type: "instance",
        obj: new ReatkactBridge.TextNode(),

        convertProps(props) {
          return {
            x: props.x ?? 0,
            y: props.y ?? 0,
            width: props.width ?? 0,
            height: props.height ?? 0,

            font: enumMap(FontType, props.font) ?? FontType.Axis,
            fontSize: props.fontSize ?? 12,
            children: getChildrenString(props.children) ?? ""
          };
        },

        applyProps(nextProps, prevProps) {
          applyBaseProps(this.obj, nextProps, prevProps);
          if (nextProps.font !== prevProps?.font) this.obj.fontType = nextProps.font;
          if (nextProps.fontSize !== prevProps?.fontSize) this.obj.fontSize = nextProps.fontSize;
          if (nextProps.children !== prevProps?.children) this.obj.text = nextProps.children;
        }
      });
    }

    case "atkTextButton": {
      return assertType<"atkTextButton">({
        type: "instance",
        obj: new ReatkactBridge.TextButtonNode(),

        convertProps(props) {
          return {
            ...props,
            x: props.x ?? 0,
            y: props.y ?? 0,
            width: props.width ?? 100,
            height: props.height ?? 28,
            children: getChildrenString(props.children) ?? ""
          };
        },
        applyProps(nextProps, prevProps) {
          applyBaseProps(this.obj, nextProps, prevProps);
          if (nextProps.children !== prevProps?.children) this.obj.text = nextProps.children;
        }
      });
    }

    default: {
      throw new Error("Unknown element type: " + type);
    }
  }
}
