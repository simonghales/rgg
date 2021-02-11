import {useHistoryStore} from "./store";

export const useCanUndo = () => {
    return useHistoryStore(state => state.pastSnapshots.length > 0)
}

export const useCanRedo = () => {
    return useHistoryStore(state => state.futureSnapshots.length > 0)
}