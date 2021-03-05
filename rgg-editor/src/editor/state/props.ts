import create from "zustand";



export enum PropOrigin {
    modified = 'modified',
    initial = 'initial',
    applied = 'applied',
    default = 'default',
}

export type Prop = {
    hidden: boolean,
    value: any,
    type: PropOrigin,
}

type PropsStore = {
    components: {
        [key: string]: {
            [key: string]: Prop,
        }
    }
}

export const usePropsStore = create<PropsStore>(() => ({
    components: {},
}))

export const setComponentProps = (id: string, updateFn: (state: any) => any) => {
    usePropsStore.setState(state => ({
        components: {
            ...state.components,
            [id]: updateFn(state.components[id] ?? {}),
        }
    }))
}

export const useComponentProps = (id: string) => {
    return usePropsStore(state => state.components[id]) ?? {}
}