import create from "zustand";
import {useMemo} from "react";

export type ComponentState = {
    uid: string,
    name: string,
    children: string[],
    isRoot: boolean,
}

type ComponentsStore = {
    components: {
        [key: string]: ComponentState,
    },
}

export const useComponentsStore = create<ComponentsStore>(() => ({
    components: {},
}))

export const useUnsavedComponentsStore = create<ComponentsStore>(() => ({
    components: {},
}))

export const useComponent = (uid: string) => {
    return useComponentsStore(state => state.components[uid])
}

export const useComponents = (uids: string[]) => {
    return useComponentsStore(state => {
        const components = uids.map((uid) => {
            return state.components[uid]
        })
        return components
    })
}

export const useComponentsRootList = () => {
    const components = useComponentsStore(state => state.components)

    return useMemo(() => {
        return Object.entries(components).filter(([, component]) => {
            return component.isRoot
        }).map(([, component]) => component)
    }, [components])

}

export const addComponent = (uid: string, name: string, children: string[], isRoot: boolean) => {
    useComponentsStore.setState(state => {
        return {
            ...state,
            components: {
                ...state.components,
                [uid]: {
                    uid,
                    name,
                    children,
                    isRoot
                }
            }
        }
    })
}

export const removeComponent = (uid: string) => {
    useComponentsStore.setState(state => {
        const components = {
            ...state.components,
        }
        delete components[uid]
        return {
            ...state,
            components,
        }
    })
}