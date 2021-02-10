import create from "zustand";
import {persist} from "zustand/middleware";
import {useMemo} from "react";
import {ComponentState} from "../types";
import {Creatable} from "../creatables";
import {generateUuid} from "../../utils/ids";
import FileSaver from "file-saver";

export type StateData = {
    [key: string]: {
        value: any,
        type?: string,
        config?: {
            [key: string]: any,
        }
    }
}

type StoredComponentState = {
    modifiedState: StateData
}

type SharedComponent = {
    appliedState: StateData,
}

export type ComponentGroup = {
    parent: string,
    isOpen: boolean,
    components: {
        [key: string]: boolean
    }
}

export type GroupedComponents = {
    [key: string]: string
}

export type ComponentsStateStore = {
    components: {
        [key: string]: StoredComponentState
    },
    sharedComponents: {
        [key: string]: SharedComponent,
    },
    selectedComponent: string,
    selectedComponents: {
        [key: string]: boolean,
    },
    unsavedComponents: {
        [key: string]: ComponentState,
    },
    deactivatedComponents: {
        [key: string]: boolean,
    },
    groups: {
        [key: string]: ComponentGroup
    },
    groupedComponents: GroupedComponents
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
    version: 1,
}))

export const useCanUndo = () => {
    return useHistoryStore(state => state.pastSnapshots.length > 0)
}

export const useCanRedo = () => {
    return useHistoryStore(state => state.futureSnapshots.length > 0)
}

const initialState: ComponentsStateStore = {
    components: {},
    sharedComponents: {},
    selectedComponent: '',
    selectedComponents: {},
    unsavedComponents: {},
    deactivatedComponents: {},
    groups: {},
    groupedComponents: {},
}

let revertState: ComponentsStateStore = initialState

export const useComponentsStateStore = create<ComponentsStateStore>(persist(() => (initialState), {
    name: 'componentsStateStore',
    onRehydrateStorage: () => {
        return (state: ComponentsStateStore) => {
            revertState = state
        }
    },
    version: 3,
    blacklist: ['selectedComponent', 'selectedComponents']
}))

export const discardChanges = () => {
    storeSnapshot()
    useComponentsStateStore.setState(revertState)
}

export const loadState = (state: ComponentsStateStore) => {
    useComponentsStateStore.setState(state)
}

export const saveChanges = () => {

    const file = new File([JSON.stringify(useComponentsStateStore.getState())], "data.json", {type: "application/json"});
    FileSaver.saveAs(file);

}

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

export const useGroup = (uid: string) => {
    return useComponentsStateStore(state => state.groups[uid] ?? true)
}

export const setGroupIsOpen = (uid: string, isOpen: boolean) => {
    useComponentsStateStore.setState(state => ({
        groups: {
            ...state.groups,
            [uid]: {
                ...state.groups[uid],
                isOpen,
            }
        }
    }))
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

export const setSelectedComponents = (components: string[]) => {
    const selectedComponents: {
        [key: string]: boolean,
    } = {}
    components.forEach((uid) => {
        selectedComponents[uid] = true
    })
    useComponentsStateStore.setState({
        selectedComponents: selectedComponents,
    })
}

export const setSelectedComponent = (selected: boolean, uid: string, override: boolean = true) => {
    useComponentsStateStore.setState(state => {
        if (override) {
            if (selected) {
                return {
                    selectedComponent: uid,
                    selectedComponents: {
                        [uid]: true,
                    }
                }
            } else {
                return {
                    selectedComponent: '',
                    selectedComponents: {},
                }
            }
        }
        if (selected) {
            return {
                selectedComponents: {
                    ...state.selectedComponents,
                    [uid]: selected
                }
            }
        } else {
            const updated = {
                ...state.selectedComponents,
            }
            delete updated[uid]
            return {
                selectedComponents: updated
            }
        }
    })
}

export const getSelectedComponent = () => {
    return useComponentsStateStore.getState().selectedComponent
}

export const getSelectedComponents = () => {
    const selectedComponents = useComponentsStateStore.getState().selectedComponents
    return Object.entries(selectedComponents).filter(([, selected]) => selected).map(([key]) => key)
}

export const useSelectedComponents = () => {
    return useComponentsStateStore(state => state.selectedComponents)
}

export const useAreComponentsSelected = () => {
    const selectedComponents = useSelectedComponents()
    const uids = Object.keys(selectedComponents)
    return uids.length > 0
}

export const useSelectedComponent = () => {
    const selectedComponents = useSelectedComponents()
    const uids = Object.keys(selectedComponents)
    if (uids.length > 0) return uids[0]
    return ''
}

export const useAreMultipleComponentsSelected = () => {
    return Object.keys(useSelectedComponents()).length > 1
}

export const useIsComponentSelected = (uid: string) => {
    const selectedComponents = useSelectedComponents()
    return !!selectedComponents[uid]
}

export const useIsOnlyComponentSelected = (uid: string) => {
    const selectedComponents = useSelectedComponents()
    return (Object.keys(selectedComponents).length === 1) && !!selectedComponents[uid]
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
    config?: {
        [key: string]: any,
    }
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

const applyStateData = (componentState: ComponentStateData, stateData: StateData, stateType: StateType, onlyExistingEntries: boolean = true) => {
    if (onlyExistingEntries) {
        Object.entries(componentState).forEach(([key, existingData]) => {
            if (stateData[key]) {
                const sourceData = stateData[key]
                const data: ComponentIndividualStateData = {
                    value: sourceData.value,
                    type: sourceData.type,
                    stateType,
                }
                componentState[key] = {
                    ...existingData,
                    ...data,
                }
            }
        })
    } else {
        Object.entries(stateData).forEach(([key, {value, type, config}]) => {
            const data: ComponentIndividualStateData = {
                value,
                type,
                stateType,
                config,
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
        applyStateData(state, defaultState, StateType.default, false)
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
} = {}, copiedFromId?: string): ComponentState => {
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
        const update: Partial<ComponentsStateStore> = {
            unsavedComponents: {
                ...state.unsavedComponents,
                [component.uid]: component,
            }
        }
        if (copiedFromId) {
            update.components = {
                ...state.components,
                [component.uid]: {
                    ...(state.components[copiedFromId] ?? {})
                }
            }
        }
        return update
    })
    return component
}