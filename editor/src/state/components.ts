import create from "zustand";
import {useMemo} from "react";
import {persist} from "zustand/middleware";
import {generateUuid} from "../utils/ids";
import {Creatable} from "./creatables";

export type ComponentState = {
    uid: string,
    name: string,
    children: string[],
    isRoot: boolean,
    componentType?: string,
}

type ComponentsStore = {
    components: {
        [key: string]: ComponentState,
    },
}

export const useComponentsStore = create<ComponentsStore>(() => ({
    components: {},
}))

export const useUnsavedComponentsStore = create<ComponentsStore>(persist(() => ({
    components: {},
}), {
    name: 'unsavedComponentsStore'
}))

export const useUnsavedComponents = () => {
    return Object.values(useUnsavedComponentsStore(state => state.components))
}

export const addNewUnsavedComponent = (creatable: Creatable): ComponentState => {
    const component: ComponentState = {
        uid: generateUuid(),
        name: creatable.name,
        children: [],
        isRoot: true,
        componentType: creatable.uid,
    }
    useUnsavedComponentsStore.setState(state => {
        return {
            components: {
                ...state.components,
                [component.uid]: component,
            }
        }
    })
    return component
}

export const useComponent = (uid: string) => {
    const savedComponent = useComponentsStore(state => state.components[uid])
    const unsavedComponent = useUnsavedComponentsStore(state => state.components[uid])
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