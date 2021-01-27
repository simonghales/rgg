import create from "zustand";
import { persist } from "zustand/middleware"
import {generateUuid} from "../utils/ids";

type TempComponents = {
    [key: string]: {
        componentKey: string,
    },
}

type StoreState = {
    tempComponents: TempComponents,
}

export const useTempComponentsStore = create<StoreState>(persist(() => ({
    tempComponents: {},
}), {
    name: 'temp-components-store'
}))

export const resetTempComponentsStore = () => {
    useTempComponentsStore.setState({
        tempComponents: {},
    })
}

export const useTempComponents = () => {
    return useTempComponentsStore(state => state.tempComponents)
}

export const addTempComponent = (key: string) => {
    useTempComponentsStore.setState(state => {
        return {
            ...state,
            tempComponents: {
                ...state.tempComponents,
                [generateUuid()]: {
                    componentKey: key,
                },
            }
        }
    })
}