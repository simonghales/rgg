import {AnyProps, ComponentState} from "./types";
import {useComponentsStore} from "./store";

export const useComponent = (id: string): ComponentState | undefined => {
    return useComponentsStore(state => state.components[id])
}

export const useComponentInitialProps = (id: string): AnyProps => {
    const component = useComponent(id)
    return component?.initialProps ?? {}
}

export const useComponentInitialProp = (id: string, propKey: string) => {
    return useComponentsStore(state => state.components[id]?.initialProps?.[propKey])
}

export const useComponentCanHaveChildren = (id: string) => {
    return useComponentsStore(state => state.componentsThatCanHaveChildren[id]) ?? false
}
