import {proxy, useProxy} from "valtio";

export const globalState = proxy({
    isEditMode: true,
})

export const useIsEditMode = () => {
    return useProxy(globalState).isEditMode
}