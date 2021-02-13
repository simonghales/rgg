import {useStateStore} from "./store";
import {useMemo} from "react";
import {ComponentIndividualStateData, ComponentStateData, SidebarItem, StateData, StateType} from "./types";
import {useComponentsStore} from "../components/components";
import {computeSidebarItems} from "./getters";

export const useGroup = (uid: string) => {
    return useStateStore(state => state.groups[uid] ?? true)
}

export const useIsComponentDeactivated = (uid: string) => {
    return useStateStore(state => state.deactivatedComponents[uid]) ?? false
}

export const useSelectedComponents = () => {
    return useStateStore(state => state.selectedComponents)
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

const useModifiedState = (uid: string): StateData => {
    const modifiedState = useStateStore(state => state.components[uid]?.modifiedState)
    return modifiedState ?? {}
}

const useAppliedState = (componentId: string): StateData => {
    const appliedState = useStateStore(state => state.sharedComponents[componentId]?.appliedState)
    return appliedState ?? {}
}

const applyStateData = (componentState: ComponentStateData, stateData: StateData, stateType: StateType, onlyExistingEntries: boolean = false) => {
    if (onlyExistingEntries) {
        Object.entries(componentState).forEach(([key, existingData]) => {
            if (stateData[key]) {
                const sourceData = stateData[key]
                const data: ComponentIndividualStateData = {
                    value: sourceData.value,
                    type: sourceData.type,
                    stateType,
                }
                if (stateType === StateType.default) {
                    data.hasDefault = true
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
        applyStateData(state, defaultState, StateType.default)
        applyStateData(state, initialState, StateType.initial)
        applyStateData(state, appliedState, StateType.applied)
        applyStateData(state, inheritedState, StateType.inherited)
        applyStateData(state, modifiedState, StateType.modified)
        return state
    }, [defaultState, initialState, modifiedState, inheritedState, appliedState])

    return componentState

}

export const useSidebarItems = (): SidebarItem[] => {
    const {groupedComponents, groups} = useStateStore(state => ({
        groupedComponents: state.groupedComponents,
        groups: state.groups,
    }))
    const {components} = useComponentsStore(state => ({
        components: state.components,
    }))
    return computeSidebarItems(components, groupedComponents, groups)
}

export const useAreComponentsInsideGroup = (componentIds: string[]): boolean => {
    let insideGroup = false

    const groupedComponents = useStateStore(state => state.groupedComponents)

    componentIds.forEach((componentId) => {
        if (groupedComponents[componentId]) {
            insideGroup = true
        }
    })

    return insideGroup
}

export const useComponentName = (componentId: string) => {
    return useStateStore(state => state.componentNames[componentId])
}