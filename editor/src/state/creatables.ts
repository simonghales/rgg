import create from "zustand";

export type CreatableOptions = {
    transformPlace: (position: [number, number, number]) => [number, number, number]
}

export type Creatable = {
    uid: string,
    name: string,
    create: (initialProps?: {
        [key: string]: any,
    }) => any,
    options?: CreatableOptions,
}

type Store = {
    creatables: {
        [key: string]: Creatable,
    },
}

export const useCreatablesStore = create<Store>(() => ({
    creatables: {},
}))

export const useCreatable = (uid: string) => {
    return useCreatablesStore(state => state.creatables[uid])
}

export const useCreatables = () => {
    return Object.values(useCreatablesStore(state => state.creatables))
}

export const getCreatable = (uid: string) => {
    return useCreatablesStore.getState().creatables[uid]
}

export const registerComponent = (uid: string, name: string, create: () => any, options?: {
    transformPlace: (position: [number, number, number]) => [number, number, number]
}) => {
    useCreatablesStore.setState(state => {
        return {
            creatables: {
                ...state.creatables,
                [uid]: {
                    uid,
                    name,
                    create,
                    options,
                }
            }
        }
    })
}