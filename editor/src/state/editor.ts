import create from "zustand";
import {ComponentStateData} from "./componentsState";

type StoreState = {
    activeComponentState: {
        [key: string]: ComponentStateData | null
    },
}

export const useEditorStore = create<StoreState>(() => ({
    activeComponentState: {},
}))

export const setActiveComponentState = (uid: string, activeComponentState: ComponentStateData | null) => {
    useEditorStore.setState({
        activeComponentState: {
            [uid]: activeComponentState,
        },
    })
}

export const useActiveComponentState = (uid: string) => {
    return useEditorStore(state => state.activeComponentState[uid])
}