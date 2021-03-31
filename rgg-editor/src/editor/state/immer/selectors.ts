import {StoreState} from "./types";

export const groupedComponentsSelector = (state: StoreState) => {
    return state.groupedComponents
}

export const sceneTreeSelector = (state: StoreState) => {
    return state.sceneTree
}
