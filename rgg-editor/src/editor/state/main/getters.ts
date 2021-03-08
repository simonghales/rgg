import {getMainStateStoreState} from "./store";

export const getSelectedComponents = () => {
    return getMainStateStoreState().selectedComponents
}

export const getUnsavedComponent = (id: string) => {
    return getMainStateStoreState().unsavedComponents[id]
}