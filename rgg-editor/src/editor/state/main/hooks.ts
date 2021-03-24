import {useMainStateStore} from "./store";
import {useCallback} from "react";
import {useIsParentHidden} from "../../../scene/InteractiveMesh.context";

export const useSelectedComponents = () => {
    return useMainStateStore(state => state.selectedComponents)
}

export const useSoleSelectedComponent = () => {
    const selectedComponents = Object.keys(useSelectedComponents())
    return selectedComponents.length === 1 ? selectedComponents[0] : ''
}

export const useComponentState = (id: string) => {
    return useMainStateStore(state => state.components[id]) ?? {}
}

export const useComponentModifiedState = (id: string) => {
    return useMainStateStore(state => state.components[id]?.modifiedState) ?? {}
}

export const useSharedComponent = (id: string) => {
    return useMainStateStore(state => state.sharedComponents[id]) ?? {}
}

export const useUnsavedComponents = () => {
    return useMainStateStore(state => state.unsavedComponents) ?? {}
}

export const useUnsavedComponent = (id: string) => {
    return useMainStateStore(state => state.unsavedComponents[id])
}

export const useIsDeactivated = (id: string) => {
    return useMainStateStore(state => state.deactivatedComponents[id]) ?? false
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