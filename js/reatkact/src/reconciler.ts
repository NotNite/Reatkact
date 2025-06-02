// https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/reconciler.tsx
import React from "react";
import ReactReconciler from "react-reconciler";
import { DefaultEventPriority, NoEventPriority } from "react-reconciler/constants";
import { createInstance } from "./bridge";
import { ReatkactContainer, ReatkactInstance, ReatkactProps, ReatkactTextInstance, ReatkactType } from "./types/react";

interface HostConfigTypes {
  type: ReatkactType;
  props: ReatkactProps;
  container: ReatkactContainer;
  instance: ReatkactInstance<ReatkactType>;
  textInstance: ReatkactTextInstance;
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

function createReconciler() {
  let currentUpdatePriority: number = NoEventPriority;

  const settings = {
    supportsMutation: true,
    supportsMicrotasks: true,
    isPrimaryRenderer: true,
    supportsPersistence: false,
    supportsHydration: false
  } as const satisfies Partial<AtkHostConfig>;

  const nodeManipulation = {
    // creating and applying props
    createInstance(type, props, rootContainer, hostContext, internalHandle) {
      const instance = createInstance(type);
      instance.applyProps(instance.convertProps(props));
      return instance;
    },
    createTextInstance(
      text,
      rootContainer,
      hostContext,
      internalHandle
    ) {
      return { type: "text", obj: text };
    },
    commitUpdate(instance, type, prevProps, nextProps, internalHandle) {
      instance.applyProps(
        instance.convertProps(nextProps),
        instance.convertProps(prevProps)
      );
    },
    commitTextUpdate(textInstance, oldText, newText) {
      console.warn("IMPL: commitTextUpdate");
    },

    // moving and deleting nodes
    appendInitialChild(parentInstance, child) {
      if (child.type === "instance") {
        parentInstance.obj.AppendNodeRaw(child.obj);
      }
    },
    appendChild(parentInstance, child) {
      if (child.type === "instance") {
        parentInstance.obj.AppendNodeRaw(child.obj);
      }
    },
    appendChildToContainer(container, child) {
      if (child.type == "instance") {
        container.obj.AppendNodeRaw(child.obj);
      }
    },
    insertBefore(parentInstance, child, beforeChild) {
      if (child.type === "instance" && beforeChild.type === "instance") {
        parentInstance.obj.InsertBeforeRaw(child.obj, beforeChild.obj);
      }
    },
    insertInContainerBefore(container, child, beforeChild) {
      if (child.type === "instance" && beforeChild.type === "instance") {
        container.obj.InsertBeforeRaw(child.obj, beforeChild.obj);
      }
    },
    removeChild(parentInstance, child) {
      if (child.type === "instance") {
        parentInstance.obj.RemoveChildRaw(child.obj);
      }
    },
    removeChildFromContainer(container, child) {
      if (child.type === "instance") {
        container.obj.RemoveChildRaw(child.obj);
      }
    }
  } as const satisfies Partial<AtkHostConfig>;

  const text = {
    shouldSetTextContent(type, props) {
      return true;
    },
    resetTextContent(instance) {
      console.warn("IMPL: resetTextContent");
    }
  } as const satisfies Partial<AtkHostConfig>;

  const visibility = {
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
    }
  } as const satisfies Partial<AtkHostConfig>;

  const updates = {
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    scheduleMicrotask: queueMicrotask,
    setCurrentUpdatePriority(newPriority) {
      currentUpdatePriority = newPriority;
    },
    getCurrentUpdatePriority() {
      return currentUpdatePriority;
    },
    resolveUpdatePriority() {
      if (currentUpdatePriority !== NoEventPriority) return currentUpdatePriority;
      return DefaultEventPriority;
    }
  } as const satisfies Partial<AtkHostConfig>;

  const getters = {
    getRootHostContext: () => ({}),
    getChildHostContext(parentHostContext) {
      return parentHostContext;
    },
    getPublicInstance(instance) {
      return instance.obj;
    }
  } as const satisfies Partial<AtkHostConfig>;

  const transition = {
    NotPendingTransition: null,
    HostTransitionContext: React.createContext<HostConfigTypes["transitionStatus"]>(null)
  } as const satisfies Partial<AtkHostConfig>;

  const stubs = {
    finalizeInitialChildren: () => false,
    commitMount() {},

    prepareForCommit: () => null,
    resetAfterCommit() {},
    preparePortalMount() {},

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
    resetFormInstance() {}
  } as const satisfies Partial<AtkHostConfig>;

  const config: AtkHostConfig = {
    ...settings,
    ...nodeManipulation,
    ...text,
    ...visibility,
    ...updates,
    ...getters,
    ...transition,
    ...stubs
  } satisfies AtkHostConfig;

  return ReactReconciler(config as any) as AtkReconciler;
}

export default createReconciler();
