import create from "zustand";
import {ComponentStateData} from "./componentsState";

type StoreState = {
    activeComponentState: {
        [key: string]: ComponentStateData | null
    },
    addingComponent: boolean,
}

export const useEditorStore = create<StoreState>(() => ({
    activeComponentState: {},
    addingComponent: false,
}))

export const useIsAddingComponent = () => {
    return useEditorStore(state => state.addingComponent)
}

export const setAddingComponent = (addingComponent: boolean) => {
    useEditorStore.setState({addingComponent})
}

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