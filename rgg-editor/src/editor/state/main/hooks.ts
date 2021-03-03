import {useMainStateStore} from "./store";

export const useSelectedComponents = () => {
    return useMainStateStore(state => state.selectedComponents)
}