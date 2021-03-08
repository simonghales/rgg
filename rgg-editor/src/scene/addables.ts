import create from "zustand";
import {EmptyObject} from "./defaultComponents/EmptyObject";

export interface Addable {
    id: string,
    name: string,
    props: {
        [key: string]: any,
    },
    component: any,
    sharedType: boolean,
}

export const useAddableStore = create<{
    addables: {
        [key: string]: Addable,
    }
}>(() => ({
    addables: {},
}))

export const useAddable = (id: string) => {
    return useAddableStore(state => state.addables[id])
}

export const getAddable = (id: string) => {
    return useAddableStore.getState().addables[id]
}

export const registerAddable = (id: string, component: any, {
    name,
    sharedType = true,
    props = {},
}: {
    name: string,
    sharedType?: boolean,
    props?: {
        [key: string]: any,
    }
}) => {
    const preppedId = `_addable/${id}`
    useAddableStore.setState(state => ({
        addables: {
            ...state.addables,
            [preppedId]: {
                id: preppedId,
                name,
                props,
                component,
                sharedType,
            }
        }
    }))
}

registerAddable('_emptyObject', EmptyObject, {
    name: 'Empty Object',
    sharedType: false,
    props: {}
})