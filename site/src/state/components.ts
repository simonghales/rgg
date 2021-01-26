import create from "zustand";
import { persist } from "zustand/middleware"
import {useEffect} from "react";

export type PropsState = {
    [key: string]: any,
}

type ComponentChildrenState = {
    [id: string]: {
        props: PropsState,
        childrenState: ComponentChildrenState,
    }
}

type ComponentState = {
    overriddenState: {
        [key: string]: boolean,
    },
    initialState: PropsState,
    modifiedState: PropsState,
    childrenState: ComponentChildrenState,
}

type ComponentsState = {
    [key: string]: ComponentState
}

type SharedComponentState = {
    appliedState: PropsState,
}

type SharedComponentsState = {
    [id: string]: SharedComponentState
}

type StoreState = {
    components: ComponentsState,
    sharedComponents: SharedComponentsState,
}

export const useComponentsStore = create<StoreState>(persist(set => ({
    components: {},
    sharedComponents: {},
}), {
    name: 'components-store'
}))

export const getSharedComponentState = (state: StoreState, id: string): SharedComponentState => {
    const component = state.sharedComponents[id]
    return component ?? {
        appliedState: {},
    }
}

export const useSharedComponentState = (id: string): SharedComponentState => {
    return useComponentsStore(state => getSharedComponentState(state, id))
}

export const getComponentStateFromComponents = (state: ComponentsState, key: string): ComponentState => {
    const component = state[key]
    return component ?? {
        overriddenState: {},
        initialState: {},
        modifiedState: {},
        childrenState: {},
    }
}

export const getComponentState = (state: StoreState, key: string): ComponentState => {
    return getComponentStateFromComponents(state.components, key)
}

const traverseChildrenState = (id: string, props: PropsState, childrenState: ComponentChildrenState) => {
    Object.entries(childrenState).forEach(([key, state]) => {
        if (key === id) {
            props = {
                ...props,
                ...state.props,
            }
        } else {
            props = traverseChildrenState(id, props, state.childrenState)
        }
    })
    return props
}

export type InternalProps = {
    [key: string]: {
        [key: string]: any,
        __id: string,
        __props?: InternalProps
    }
}

const mapInternalProps = (internalProps: InternalProps) => {

    const childrenState: ComponentChildrenState = {}

    Object.entries(internalProps).forEach(([key, {__id, __props, ...values}]) => {
        childrenState[__id] = {
            props: {
                ...values,
            },
            childrenState: __props ? mapInternalProps(__props) : {},
        }
    })
    return childrenState
}

export const useSetComponentChildrenState = (id: string, internalProps: InternalProps) => {

    useEffect(() => {
        const childrenState: ComponentChildrenState = mapInternalProps(internalProps)
        useComponentsStore.setState(state => {
            const component = getComponentState(state, id)
            return {
                ...state,
                components: {
                    ...state.components,
                    [id]: {
                        ...component,
                        childrenState,
                    }
                }
            }
        })
    }, [])

}

const deleteChildState = (childrenState: ComponentChildrenState, id: string, propKey: string) => {
    Object.entries(childrenState).forEach(([childId, value]) => {
        if (childId === id) {
            delete value.props[propKey]
        } else {
            deleteChildState(value.childrenState, id, propKey)
        }
    })
}

export const resetInheritedComponentProp = (id: string, parentPath: string[], propKey: string) => {
    useComponentsStore.setState(state => {

        const updatedComponents = {
            ...state.components,
        }

        parentPath.forEach((parentId: string) => {
            const component = getComponentState(state, parentId)
            const childrenState = {
                ...component.childrenState,
            }
            deleteChildState(childrenState, id, propKey)
            updatedComponents[parentId] = {
                ...component,
                childrenState,
            }
        })

        return {
            ...state,
            components: updatedComponents,
        }
    })
}

export const useInheritedComponentState = (id: string, parentPath: string[]): PropsState => {
    const components = useComponentsStore(state => state.components)
    let props: PropsState = {}
    parentPath.slice().reverse().forEach((parentId: string) => {
        const component = getComponentStateFromComponents(components, parentId)
        props = traverseChildrenState(id, props, component.childrenState)
    })
    return props
}

export const setComponentOverridenState = (key: string, update: PropsState | ((state: PropsState) => PropsState)) => {

    const handleUpdate = (state: PropsState) => {
        if (typeof update === "function") {
            return update(state)
        } else {
            return update
        }
    }

    useComponentsStore.setState(state => {
        const component = getComponentState(state, key)
        return {
            components: {
                ...state.components,
                [key]: {
                    ...component,
                    overriddenState: handleUpdate(component.overriddenState)
                }
            }
        }
    })

}

export const setComponentInitialState = (key: string, update: PropsState | ((state: PropsState) => PropsState)) => {

    const handleUpdate = (state: PropsState) => {
        if (typeof update === "function") {
            return update(state)
        } else {
            return update
        }
    }

    useComponentsStore.setState(state => {
        const component = getComponentState(state, key)
        return {
            components: {
                ...state.components,
                [key]: {
                    ...component,
                    initialState: handleUpdate(component.initialState)
                }
            }
        }
    })
}

export const useComponentState = (key: string, props: PropsState): ComponentState => {

    useEffect(() => {
        setComponentInitialState(key, props)
    }, [])

    return useComponentsStore(state => getComponentState(state, key))
}

export const setComponentModifiedState = (key: string, update: PropsState | ((state: PropsState) => PropsState)) => {

    const handleUpdate = (state: PropsState) => {
        if (typeof update === "function") {
            return update(state)
        } else {
            return update
        }
    }

    useComponentsStore.setState(state => {
        const component = getComponentState(state, key)
        return {
            components: {
                ...state.components,
                [key]: {
                    ...component,
                    modifiedState: handleUpdate(component.modifiedState)
                }
            }
        }
    })
}

export const setComponentAppliedState = (id: string, update: PropsState | ((state: PropsState) => PropsState)) => {

    const handleUpdate = (state: PropsState) => {
        if (typeof update === "function") {
            return update(state)
        } else {
            return update
        }
    }

    useComponentsStore.setState(state => {
        const component = getSharedComponentState(state, id)
        return {
            sharedComponents: {
                ...state.sharedComponents,
                [id]: {
                    ...component,
                    appliedState: handleUpdate(component.appliedState)
                }
            }
        }
    })
}