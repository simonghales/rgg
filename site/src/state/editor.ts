import create from "zustand";
import {generateUuid} from "../utils/ids";

type StoreState = {
    registeredComponents: {
        [key: string]: {
            name: string,
            createFunction: () => any,
        }
    },
}

export const useRegisterStore = create<StoreState>(() => ({
    registeredComponents: {},
}))

export const useRegisteredComponents = () => {
    return useRegisterStore(state => state.registeredComponents)
}

export const registerComponent = (name: string, createFunction: () => any) => {
    const key = generateUuid()
    useRegisterStore.setState(state => {
        return {
            ...state,
            registeredComponents: {
                ...state.registeredComponents,
                [key]: {
                    name,
                    createFunction,
                }
            }
        }
    })
}