import {useComponentsStore} from "./store";

export const getComponents = () => {
    return useComponentsStore.getState().components
}
