import {getMainStateStoreState} from "./store";

export const getSelectedComponents = () => {
    return getMainStateStoreState().selectedComponents
}