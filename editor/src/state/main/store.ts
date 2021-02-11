import {StateStore} from "./types";
import create from "zustand";
import {persist} from "zustand/middleware";

export const initialStoreState: StateStore = {
    componentNames: {},
    components: {},
    sharedComponents: {},
    selectedComponents: {},
    selectedComponent: '',
    unsavedComponents: {},
    deactivatedComponents: {},
    groups: {},
    groupedComponents: {},
}

export let revertState: StateStore = initialStoreState

export const useStateStore = create<StateStore>(persist(() => (initialStoreState), {
    name: 'componentsStateStore',
    onRehydrateStorage: () => {
        return (state: StateStore) => {
            revertState = state
        }
    },
    version: 4,
    blacklist: ['selectedComponents', 'selectedComponent']
}))