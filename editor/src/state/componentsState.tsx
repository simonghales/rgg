import create from "zustand";
import { persist } from "zustand/middleware";
import {useMemo} from "react";

export type StateData = {
    [key: string]: {
        value: any,
        type?: string,
    }
}

type ComponentState = {
    modifiedState: StateData
}

type SharedComponent = {
    appliedState: StateData,
}

type ComponentsStateStore = {
    components: {
        [key: string]: ComponentState
    },
    sharedComponents: {
        [key: string]: SharedComponent,
    },
    selectedComponent: string,
}

export const useComponentsStateStore = create<ComponentsStateStore>(persist(() => ({
    components: {},
    sharedComponents: {},
    selectedComponent: '',
}), {
    name: 'componentsStateStore'
}))

export const setSelectedComponent = (uid: string) => {
    useComponentsStateStore.setState({
        selectedComponent: uid,
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

export type ComponentStateData = {
    [key: string]: {
        value: any,
        stateType: StateType,
        type?: string,
    }
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
        componentState[key] = {
            value,
            type,
            stateType,
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