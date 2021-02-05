import create from "zustand";
import {persist} from "zustand/middleware";
import {useMemo} from "react";
import {ComponentState} from "./types";
import {Creatable} from "./creatables";
import {generateUuid} from "../utils/ids";

export type StateData = {
    [key: string]: {
        value: any,
        type?: string,
    }
}

type StoredComponentState = {
    modifiedState: StateData
}

type SharedComponent = {
    appliedState: StateData,
}

type ComponentsStateStore = {
    components: {
        [key: string]: StoredComponentState
    },
    sharedComponents: {
        [key: string]: SharedComponent,
    },
    selectedComponent: string,
    unsavedComponents: {
        [key: string]: ComponentState,
    },
    deactivatedComponents: {
        [key: string]: boolean,
    }
}

type HistoryStore = {
    pastSnapshots: ComponentsStateStore[],
    futureSnapshots: ComponentsStateStore[],
}

// @ts-ignore
export const useHistoryStore = create<HistoryStore>(persist(() => ({
    pastSnapshots: [],
    futureSnapshots: [],
}), {
    name: 'historyStore',
}))

export const useCanUndo = () => {
    return useHistoryStore(state => state.pastSnapshots.length > 0)
}

export const useCanRedo = () => {
    return useHistoryStore(state => state.futureSnapshots.length > 0)
}

export const useComponentsStateStore = create<ComponentsStateStore>(persist(() => ({
    components: {},
    sharedComponents: {},
    selectedComponent: '',
    unsavedComponents: {},
    deactivatedComponents: {},
}), {
    name: 'componentsStateStore'
}))

export const undoState = () => {
    const pastSnapshots = useHistoryStore.getState().pastSnapshots
    const newSnapshot = pastSnapshots[pastSnapshots.length - 1]
    if (!newSnapshot) return
    const currentSnapshot = useComponentsStateStore.getState()
    useComponentsStateStore.setState(newSnapshot)
    useHistoryStore.setState(state => {
        return {
            pastSnapshots: pastSnapshots.slice(0, pastSnapshots.length - 1),
            futureSnapshots: state.futureSnapshots.concat([currentSnapshot])
        }
    })
}

export const redoState = () => {
    const futureSnapshots = useHistoryStore.getState().futureSnapshots
    const newSnapshot = futureSnapshots[futureSnapshots.length - 1]
    if (!newSnapshot) return
    const currentSnapshot = useComponentsStateStore.getState()
    useComponentsStateStore.setState(newSnapshot)
    useHistoryStore.setState(state => {
        return {
            futureSnapshots: futureSnapshots.slice(0, futureSnapshots.length - 1),
            pastSnapshots: state.pastSnapshots.concat([currentSnapshot])
        }
    })
}

export const storeSnapshot = () => {
    useHistoryStore.setState(state => {
        const pastSnapshots = state.pastSnapshots.concat([useComponentsStateStore.getState()])
        if (pastSnapshots.length > 20) {
            pastSnapshots.shift()
        }
        return {
            pastSnapshots,
            futureSnapshots: [],
        }
    })
}

export const addDeactivatedComponent = (uid: string) => {
    storeSnapshot()
    useComponentsStateStore.setState(state => ({
        deactivatedComponents: {
            ...state.deactivatedComponents,
            [uid]: true,
        }
    }))
}

export const removeDeactivatedComponent = (uid: string) => {
    storeSnapshot()
    useComponentsStateStore.setState(state => {
        const update = {
            ...state.deactivatedComponents,
        }
        delete update[uid]
        return {
            deactivatedComponents: update
        }
    })
}

export const useIsComponentDeactivated = (uid: string) => {
    return useComponentsStateStore(state => state.deactivatedComponents[uid]) ?? false
}

export const setSelectedComponent = (uid: string, from?: string) => {
    useComponentsStateStore.setState(state => {
        if (!from) {
            return {
                selectedComponent: uid,
            }
        }
        if (state.selectedComponent === from) {
            return {
                selectedComponent: uid,
            }
        }
        return {}
    })
}

export const useSelectedComponent = () => {
    return useComponentsStateStore(state => state.selectedComponent)
}

export const useIsSelectedComponent = (uid: string) => {
    return useSelectedComponent() === uid
}

export const getComponent = (uid: string) => {
    return useComponentsStateStore.getState().components[uid] ?? {
        modifiedState: {}
    }
}

export const updateComponentModifiedState = (uid: string, key: string, value: any) => {
    storeSnapshot()
    const component = getComponent(uid)
    useComponentsStateStore.setState(state => {
        return {
            components: {
                ...state.components,
                [uid]: {
                    ...component,
                    modifiedState: {
                        ...component.modifiedState,
                        [key]: {
                            value,
                        }
                    }
                }
            },
        }
    })
}

export enum StateType {
    default = 'default',
    initial = 'initial',
    applied = 'applied',
    inherited = 'inherited',
    modified = 'modified',
}

export type ComponentIndividualStateData = {
    defaultValue?: any,
    value: any,
    stateType: StateType,
    type?: string,
}

export type ComponentStateData = {
    [key: string]: ComponentIndividualStateData
}

const useModifiedState = (uid: string): StateData => {
    const modifiedState = useComponentsStateStore(state => state.components[uid]?.modifiedState)
    return modifiedState ?? {}
}

const useAppliedState = (componentId: string): StateData => {
    const appliedState = useComponentsStateStore(state => state.sharedComponents[componentId]?.appliedState)
    return appliedState ?? {}
}

const applyStateData = (componentState: ComponentStateData, stateData: StateData, stateType: StateType) => {
    Object.entries(stateData).forEach(([key, {value, type}]) => {
        const data: ComponentIndividualStateData = {
            value,
            type,
            stateType,
        }
        if (stateType === StateType.default) {
            data.defaultValue = value
        }
        componentState[key] = {
            ...(componentState[key] || {}),
            ...data
        }
    })
}

export const useComponentState = (
    uid: string,
    componentId: string,
    defaultState: StateData,
    initialState: StateData,
    inheritedState: StateData,
): ComponentStateData => {

    const modifiedState = useModifiedState(uid)
    const appliedState = useAppliedState(componentId)

    const componentState = useMemo(() => {
        const state: ComponentStateData = {}
        applyStateData(state, defaultState, StateType.default)
        applyStateData(state, initialState, StateType.initial)
        applyStateData(state, appliedState, StateType.applied)
        applyStateData(state, inheritedState, StateType.inherited)
        applyStateData(state, modifiedState, StateType.modified)
        return state
    }, [defaultState, initialState, modifiedState, inheritedState, appliedState])

    return componentState

}
export const removeUnsavedComponent = (uid: string) => {
    storeSnapshot()
    useComponentsStateStore.setState(state => {
        const component = state.unsavedComponents[uid]
        if (!component) return {}
        const updatedComponents = {
            ...state.unsavedComponents,
        }
        delete updatedComponents[uid]
        return {
            unsavedComponents: updatedComponents
        }
    })
}
export const addNewUnsavedComponent = (creatable: Creatable, initialProps: {
    [key: string]: any,
} = {}): ComponentState => {
    storeSnapshot()
    const component: ComponentState = {
        uid: generateUuid(),
        name: creatable.name,
        children: [],
        isRoot: true,
        componentType: creatable.uid,
        initialProps,
    }
    useComponentsStateStore.setState(state => {
        return {
            unsavedComponents: {
                ...state.unsavedComponents,
                [component.uid]: component,
            }
        }
    })
    return component
}