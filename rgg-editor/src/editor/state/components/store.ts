import {AnyProps, ComponentState} from "./types";
import create from "zustand";

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

export const setComponentInitialProps = (uid: string, initialProps: AnyProps) => {
    // @ts-ignore
    useComponentsStore.setState(state => {
        if (!state.components[uid]) return {}
        return {
            components: {
                ...state.components,
                [uid]: {
                    ...(state.components[uid] ?? {}),
                    initialProps,
                }
            }
        }
    })
}

export const setComponentChildren = (uid: string, children: string[]) => {
    // @ts-ignore
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

export const addComponent = (uid: string, name: string, children: string[], isRoot: boolean, unsaved: boolean, initialProps: AnyProps = {}) => {
    useComponentsStore.setState(state => {
        return {
            components: {
                ...state.components,
                [uid]: {
                    uid,
                    name,
                    children,
                    isRoot,
                    unsaved,
                    initialProps,
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