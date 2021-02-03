import create from "zustand";

type Store = {
    components: {
        [key: string]: {
            sidebarHovered: boolean,
            editorHovered: boolean,
        }
    }
}

export const useLocalStateStore = create<Store>(() => ({
    components: {},
}))

export const setComponentSidebarHovered = (uid: string, hovered: boolean) => {
    useLocalStateStore.setState(state => ({
        components: {
            ...state.components,
            [uid]: {
                ...(state.components[uid] || {}),
                sidebarHovered: hovered,
            }
        }
    }))
}

export const setComponentEditorHovered = (uid: string, hovered: boolean) => {
    useLocalStateStore.setState(state => ({
        components: {
            ...state.components,
            [uid]: {
                ...(state.components[uid] || {}),
                editorHovered: hovered,
            }
        }
    }))
}

export const useIsHovered = (uid: string): boolean => {
    const component = useLocalStateStore(state => state.components[uid])
    return component ? (component.editorHovered || component.sidebarHovered) : false
}