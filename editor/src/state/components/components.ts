import create from "zustand";
import {useMemo} from "react";
import {ComponentState} from "../types";
import {useStateStore} from "../main/store";

export type ComponentsStore = {
    components: {
        [key: string]: ComponentState,
    },
    deactivatedComponents: {
        [key: string]: ComponentState,
    }
}

export const useComponentsStore = create<ComponentsStore>(() => ({
    components: {},
    deactivatedComponents: {},
}))

export const useUnsavedComponents = () => {
    return Object.values(useStateStore(state => state.unsavedComponents))
}

export const useComponent = (uid: string) => {
    const savedComponent = useComponentsStore(state => state.components[uid])
    const unsavedComponent = useStateStore(state => state.unsavedComponents[uid])
    return savedComponent ?? unsavedComponent
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

export const getComponentsRootList = () => {
    const components = useComponentsStore.getState().components
    return Object.entries(components).filter(([, component]) => {
        return component.isRoot
    }).map(([, component]) => component)
}

export const setComponentChildren = (uid: string, children: string[]) => {
    useComponentsStore.setState(state => {
        if (!state.components[uid]) return {}
        return {
            components: {
                ...state.components,
                [uid]: {
                    ...(state.components[uid] ?? {}),
                    children,
                }
            }
        }
    })
}

export const addComponent = (uid: string, name: string, children: string[], isRoot: boolean, unsaved: boolean) => {
    useComponentsStore.setState(state => {
        return {
            components: {
                ...state.components,
                [uid]: {
                    uid,
                    name,
                    children,
                    isRoot,
                    unsaved
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
            components,
        }
    })
}

export const addDeactivatedComponent = (uid: string, name: string, children: string[], isRoot: boolean, unsaved: boolean) => {
    useComponentsStore.setState(state => {
        return {
            deactivatedComponents: {
                ...state.deactivatedComponents,
                [uid]: {
                    uid,
                    name,
                    children,
                    isRoot,
                    unsaved
                }
            }
        }
    })
}

export const removeDeactivatedComponent = (uid: string) => {
    useComponentsStore.setState(state => {
        const components = {
            ...state.deactivatedComponents,
        }
        delete components[uid]
        return {
            deactivatedComponents: components,
        }
    })
}