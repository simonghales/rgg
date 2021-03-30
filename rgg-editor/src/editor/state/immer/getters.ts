import {getStoreState} from "./immer";

export const getSelectedComponents = () => {
    return getStoreState().selectedComponents
}

export const getUnsavedComponent = (id: string) => {
    return getStoreState().unsavedComponents[id]
}
