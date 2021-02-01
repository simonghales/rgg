import create from "zustand";

type Creatable = {
    uid: string,
    name: string,
    create: () => any,
}

type Store = {
    creatables: {
        [key: string]: Creatable,
    },
}

export const useCreatablesStore = create<Store>(() => ({
    creatables: {},
}))

export const registerComponent = (uid: string, name: string, create: () => any) => {
    useCreatablesStore.setState(state => {
        return {
            creatables: {
                ...state.creatables,
                [uid]: {
                    uid,
                    name,
                    create,
                }
            }
        }
    })
}