import {proxy, useProxy} from "valtio";

export const uiProxy = proxy<{
    displayAddingComponent: boolean,
    displayAddingComponentParent: string,
    addingComponent: string,
    addingComponentParent: string,
    componentContextMenu: {
        visible: boolean,
        components?: string[],
        position?: [number, number],
    },
    hoveredComponents: {
        [key: string]: true,
    }
}>({
    displayAddingComponent: false,
    displayAddingComponentParent: '',
    addingComponent: '',
    addingComponentParent: '',
    componentContextMenu: {
        visible: false,
        components: [],
    },
    hoveredComponents: {}
})

export const setComponentHovered = (id: string) => {
    uiProxy.hoveredComponents = {
        ...uiProxy.hoveredComponents,
        [id]: true,
    }
    return () => {
        const update = {
            ...uiProxy.hoveredComponents,
        }
        delete update[id]
        uiProxy.hoveredComponents = update
    }
}

export const useIsComponentHovered = (id: string) => {
    const hoveredComponents = useProxy(uiProxy).hoveredComponents
    return hoveredComponents[id] ?? false
}

export const displayComponentContextMenu = (components: string[], position: [number, number]) => {
    uiProxy.componentContextMenu = {
        visible: true,
        components,
        position,
    }
}

export const setDisplayAddingComponentParent = (id: string) => {
    uiProxy.displayAddingComponentParent = id
}

export const setAddingComponent = (id: string) => {
    uiProxy.addingComponent = id
    uiProxy.addingComponentParent = uiProxy.displayAddingComponentParent
}

export const setDisplayAddingComponent = (adding: boolean, parent?: string = '') => {
    if (adding) {
        setDisplayAddingComponentParent(parent)
    }
    uiProxy.displayAddingComponent = adding
    if (!adding) {
        addingComponentClosed = Date.now()
    }
}

export let addingComponentClosed = 0