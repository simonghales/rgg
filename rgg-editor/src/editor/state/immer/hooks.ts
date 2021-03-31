import {useMainStateStore} from "./immer";
import {useCallback} from "react";
import {useIsParentHidden} from "../../../scene/InteractiveMesh.context";
import {StoreState} from "./types";

const selectedComponentsSelector = (state: StoreState) => state.selectedComponents

export const useSelectedComponents = () => {
    return useMainStateStore(selectedComponentsSelector)
}

export const useSoleSelectedComponent = () => {
    const selectedComponents = Object.keys(useSelectedComponents())
    return selectedComponents.length === 1 ? selectedComponents[0] : ''
}

export const useComponentState = (id: string) => {
    return useMainStateStore(useCallback(state => state.components[id], [id])) ?? {}
}

export const useComponentModifiedStateProp = (id: string, propKey: string) => {
    return useMainStateStore(useCallback(state => state.components[id]?.modifiedState?.[propKey], [id]))
}

export const useComponentOverriddenStateProp = (id: string, propKey: string) => {
    return useMainStateStore(useCallback(state => state.components[id]?.overriddenState?.[propKey], [id])) ?? false
}

export const useComponentModifiedState = (id: string) => {
    return useMainStateStore(useCallback(state => state.components[id]?.modifiedState, [id])) ?? {}
}

export const useSharedComponent = (id: string) => {
    return useMainStateStore(useCallback(state => state.sharedComponents[id], [id])) ?? {}
}

export const useSharedComponentAppliedStateProp = (id: string, propKey: string) => {
    return useMainStateStore(useCallback(state => state.sharedComponents[id]?.appliedState?.[propKey], [id]))
}

const unsavedComponentsSelector = (state: StoreState) => state.unsavedComponents

export const useUnsavedComponents = () => {
    return useMainStateStore(unsavedComponentsSelector) ?? {}
}

export const useUnsavedComponent = (id: string) => {
    return useMainStateStore(useCallback(state => state.unsavedComponents[id], [id]))
}

export const useIsDeactivated = (id: string) => {
    return useMainStateStore(useCallback(state => state.deactivatedComponents[id], [id])) ?? false
}

export const useComponentName = (id: string) => {
    return useMainStateStore(useCallback(state => state.componentNames[id]?.name, [id])) ?? ''
}

export const useGroup = (id: string) => {
    return useMainStateStore(useCallback(state => state.groups[id], [id]))
}

export const useIsComponentVisible = (id: string) => {
    return useMainStateStore(useCallback(state => state.componentsVisibility[id] ?? true, [id]))
}

export const useComponentGroupId = (id: string) => {
    return useMainStateStore(useCallback(state => state.groupedComponents[id], [id] ?? ''))
}

export const useIsParentGroupHidden = (id: string) => {
    const groupId = useComponentGroupId(id)
    return !useIsComponentVisible(groupId)
}

export const useIsHidden = (id: string) => {
    const parentGroupHidden = useIsParentGroupHidden(id)
    const parentHidden = useIsParentHidden()
    const componentVisible = useIsComponentVisible(id)
    return parentGroupHidden || parentHidden || !componentVisible
}

export const useIsItemSelected = (id: string) => {
    const selectedComponents = Object.keys(useSelectedComponents())
    return selectedComponents.includes(id)
}
