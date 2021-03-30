import produce, {Draft} from "immer";
import create, {State, StateCreator, UseStore} from "zustand";
import {StoreState} from "./types";
import pipe from "ramda/es/pipe"
import {persist} from "zustand/middleware";

const immer = <T extends State>(
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
    config((fn) => set(produce<T>(fn)), get, api)

// todo - incorporate patches

// @ts-ignore
const history: any = config => persist(config, {
    name: '_mainStateStore',
    // @ts-ignore
    onRehydrateStorage: () => {
        return (state: StoreState) => {
            console.log('state', state)
        }
    },
    version: 5,
    blacklist: []
})

// @ts-ignore
const createStore: any = pipe(immer, history, create)

const initialState: StoreState = {
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
    componentsVisibility: {},
}

type CombinedStoreState = UseStore<StoreState & {
    set: (fn: (state: Draft<StoreState>) => void) => void,
}>

const useStore: CombinedStoreState = createStore(() => (initialState))

const {
    getState,
    setState,
} = useStore

export const setStoreState = setState

export const getStoreState = getState

export const useMainStateStore = useStore
