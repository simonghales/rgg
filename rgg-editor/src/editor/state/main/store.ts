import create from "zustand";
import {persist} from "zustand/middleware";
import {MainStateStore} from "./types";

export const initialStoreState: MainStateStore = {
    componentNames: {},
    components: {},
    sharedComponents: {},
    selectedComponents: {},
    sceneTree: [],
    componentsTree: {},
    unsavedComponents: {},
    deactivatedComponents: {},
    groups: {},
    groupedComponents: {},
}

export let revertState: MainStateStore = initialStoreState

export const useMainStateStore = create<MainStateStore>(persist(() => (initialStoreState), {
    name: 'mainStateStore',
    // @ts-ignore
    onRehydrateStorage: () => {
        return (state: MainStateStore) => {
            revertState = state
        }
    },
    version: 5,
    blacklist: []
}))

const {
    setState: setMainStateStoreState,
    getState: getMainStateStoreState,
} = useMainStateStore

export {
    setMainStateStoreState,
    getMainStateStoreState,
}