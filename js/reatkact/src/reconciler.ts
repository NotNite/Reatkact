// https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/reconciler.tsx
import React from "react";
import ReactReconciler from "react-reconciler";
import { DefaultEventPriority, NoEventPriority } from "react-reconciler/constants";
import { FontType } from "./types";
import { ReatkactContainer, ReatkactInstance, ReatkactProps, ReatkactType } from "./types/react";

interface HostConfigTypes {
  type: ReatkactType;
  props: ReatkactProps;
  container: ReatkactContainer;
  instance: ReatkactInstance<any>;
  textInstance: string;
  suspenseInstance: never;
  hydratableInstance: never;
  formInstance: never;
  publicInstance: unknown;
  hostContext: {};
  childSet: never;
  timeoutHandle: NodeJS.Timeout;
  noTimeout: -1;
  transitionStatus: null;
}

// nice types bro
type HostConfigExtras = {
  HostTransitionContext: React.Context<HostConfigTypes["transitionStatus"]>;
};

type AtkHostConfig =
  & Omit<
    ReactReconciler.HostConfig<
      HostConfigTypes["type"],
      HostConfigTypes["props"],
      HostConfigTypes["container"],
      HostConfigTypes["instance"],
      HostConfigTypes["textInstance"],
      HostConfigTypes["suspenseInstance"],
      HostConfigTypes["hydratableInstance"],
      HostConfigTypes["formInstance"],
      HostConfigTypes["publicInstance"],
      HostConfigTypes["hostContext"],
      HostConfigTypes["childSet"],
      HostConfigTypes["timeoutHandle"],
      HostConfigTypes["noTimeout"],
      HostConfigTypes["transitionStatus"]
    >,
    keyof HostConfigExtras
  >
  & HostConfigExtras;
export type AtkReconciler = ReactReconciler.Reconciler<
  HostConfigTypes["container"],
  HostConfigTypes["instance"],
  HostConfigTypes["textInstance"],
  HostConfigTypes["suspenseInstance"],
  HostConfigTypes["formInstance"],
  HostConfigTypes["publicInstance"]
>;

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

function createInstance<T extends ReatkactType>(type: T): ReatkactInstance<T> {
  const assertType = <TT extends ReatkactType>(obj: ReatkactInstance<TT>) => {
    // I don't know why this is needed. is my type broken? did I find a tsc bug? who knows!
    return obj as ReatkactInstance<T>;
  };

  switch (type) {
    case "atkText": {
      return assertType({
        instance: new BridgeTextNode(),
        applyProps(props) {
          this.instance.ApplyProps({
            ...props,
            font: enumMap(FontType, props.font),
            children: getChildrenString(props.children)
          });
        }
      });
    }

    case "atkTextButton": {
      return assertType({
        instance: new BridgeTextButtonNode(),
        applyProps(props) {
          this.instance.ApplyProps({
            ...props,
            children: getChildrenString(props.children)
          });
        }
      });
    }

    default: {
      throw new Error("Unknown element type: " + type);
    }
  }
}

export default function createReconciler(container: ReatkactContainer) {
  let currentUpdatePriority: number = NoEventPriority;

  const config: AtkHostConfig = {
    supportsMutation: true,
    supportsMicrotasks: true,
    isPrimaryRenderer: true,
    supportsPersistence: false,
    supportsHydration: false,

    // creation and props application
    createInstance(type, props, rootContainer, hostContext, internalHandle) {
      const instance = createInstance(type);
      instance.applyProps(props);
      return instance;
    },
    createTextInstance(
      text,
      rootContainer,
      hostContext,
      internalHandle
    ) {
      return text;
    },
    commitUpdate(instance, type, prevProps, nextProps, internalHandle) {
      // TODO: this is slow, only send what changes
      instance.applyProps(nextProps);
    },
    commitTextUpdate(textInstance, oldText, newText) {
      throw new Error("Function not implemented.");
    },

    // application and moving nodes
    appendInitialChild(parentInstance, child) {
      if (typeof child === "string") return;
      parentInstance.instance.AppendNode(child.instance);
    },
    appendChild(parentInstance, child) {
      if (typeof child === "string") return;
      parentInstance.instance.AppendNode(child.instance);
    },
    appendChildToContainer(container, child) {
      if (typeof child === "string") return;
      console.log("appendChildToContainer", container, child);
      container.AppendNode(child.instance);
    },
    insertBefore(parentInstance, child, beforeChild) {
      if (typeof child === "string" || typeof beforeChild === "string") return;
      parentInstance.instance.InsertBefore(child.instance, beforeChild.instance);
    },
    insertInContainerBefore(container, child, beforeChild) {
      if (typeof child === "string" || typeof beforeChild === "string") return;
      container.InsertBefore(child.instance, beforeChild.instance);
    },
    removeChild(parentInstance, child) {
      if (typeof child === "string") return;
      parentInstance.instance.RemoveChild(child.instance);
    },
    removeChildFromContainer(container, child) {
      if (typeof child === "string") return;
      container.RemoveChild(child.instance);
    },

    // text
    shouldSetTextContent(type, props) {
      if ("children" in props && typeof props.children === "string") return true;
      const types: ReatkactType[] = ["atkText"];
      return types.includes(type);
    },
    resetTextContent(instance) {
      console.warn("IMPL: resetTextContent");
    },

    // visibility
    hideInstance(instance) {
      console.warn("IMPL: hideInstance");
    },
    hideTextInstance(textInstance) {
      console.warn("IMPL: hideTextInstance");
    },
    unhideInstance(instance, props) {
      console.warn("IMPL: unhideInstance");
    },
    unhideTextInstance(textInstance, text) {
      console.warn("IMPL: unhideTextInstance");
    },
    clearContainer(container) {
      console.warn("IMPL: clearContainer");
    },

    // updates
    setCurrentUpdatePriority(newPriority) {
      currentUpdatePriority = newPriority;
    },
    getCurrentUpdatePriority() {
      return currentUpdatePriority;
    },
    resolveUpdatePriority() {
      if (currentUpdatePriority !== NoEventPriority) return currentUpdatePriority;
      return DefaultEventPriority;
    },

    finalizeInitialChildren: () => false,
    commitMount() {},

    getRootHostContext: () => ({}),
    getChildHostContext(parentHostContext) {
      return parentHostContext; // TODO check
    },
    getPublicInstance(instance) {
      return instance; // TODO check
    },

    prepareForCommit: () => null,
    resetAfterCommit() {},
    preparePortalMount() {},

    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    scheduleMicrotask: queueMicrotask,

    maySuspendCommit: () => false,
    preloadInstance: () => true,
    startSuspendingCommit() {},
    suspendInstance() {},
    waitForCommitToBeReady: () => null,

    getInstanceFromNode: () => null,
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    prepareScopeUpdate() {},
    getInstanceFromScope: () => null,
    shouldAttemptEagerTransition: () => false,
    trackSchedulerEvent: () => {},
    resolveEventType: () => null,
    resolveEventTimeStamp: () => -1.1,
    requestPostPaintCallback() {},
    detachDeletedInstance() {},
    resetFormInstance() {},

    NotPendingTransition: null,
    HostTransitionContext: React.createContext<HostConfigTypes["transitionStatus"]>(null)
  } satisfies AtkHostConfig;

  return ReactReconciler(config as any) as AtkReconciler;
}
