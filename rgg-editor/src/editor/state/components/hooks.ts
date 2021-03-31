import {AnyProps, ComponentState} from "./types";
import {useComponentsStore} from "./store";
import {useCallback} from "react";

export const useComponent = (id: string): ComponentState | undefined => {
    return useComponentsStore(useCallback(state => state.components[id], [id]))
}

export const useComponentInitialProps = (id: string): AnyProps => {
    return useComponentsStore(useCallback(state => state.componentsInitialProps[id], [id])) ?? {}
}

export const useComponentInitialProp = (id: string, propKey: string) => {
    return useComponentsStore(useCallback(state => state.componentsInitialProps[id]?.[propKey], [id]))
}

export const useComponentCanHaveChildren = (id: string) => {
    return useComponentsStore(state => state.componentsThatCanHaveChildren[id]) ?? false
}
