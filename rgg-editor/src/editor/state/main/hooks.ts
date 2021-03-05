import {useMainStateStore} from "./store";

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
    return useMainStateStore(state => state.componentNames[id]?.name) ?? ''
}