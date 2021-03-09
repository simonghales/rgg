import {getMainStateStoreState, setMainStateStoreState} from "./store";
import {TreeData} from "@atlaskit/tree";
import {MainStateStore} from "./types";
import {Addable, getAddable} from "../../../scene/addables";
import {generateUid, getCombinedId} from "../../../utils/ids";
import {predefinedPropKeys} from "../../componentEditor/config";
import {ROOT_ID} from "../../SceneList";
import {addToClipboard, clearClipboard, clipboardProxy, PendingPasteType} from "../editor";
import {getSelectedComponents, getUnsavedComponent} from "./getters";
import {ComponentState} from "../components/types";
import {storeSnapshot} from "../history/actions";

export const resetComponentProp = (componentId: string, propKey: string) => {
    setMainStateStoreState(state => {
        let component = state.components[componentId] ?? {}
        component = {
            ...component,
            overriddenState: {
                ...(component.overriddenState ?? {}),
                [propKey]: true,
            }
        }
        return {
            components: {
                ...state.components,
                [componentId]: component,
            }
        }
    })
}

export const setSharedComponentPropValue = (componentTypeId: string, propKey: string, propValue: any) => {
    setMainStateStoreState(state => {
        let component = state.sharedComponents[componentTypeId] ?? {}
        component = {
            ...component,
            appliedState: {
                ...(component.appliedState ?? {}),
                [propKey]: {
                    value: propValue,
                }
            }
        }
        return {
            sharedComponents: {
                ...state.sharedComponents,
                [componentTypeId]: component,
            }
        }
    })
}

export const setComponentPropValue = (componentId: string, propKey: string, propValue: any) => {
    setMainStateStoreState(state => {
        let component = state.components[componentId] ?? {}
        let updatedValue = propValue
        if (typeof propValue === 'function') {
            const {modifiedState = {}} = component
            const { [propKey]: originalProp = {
                value: undefined,
            } } = modifiedState
            const {
                value
            } = originalProp
            updatedValue = propValue(value)
        }
        component = {
            ...component,
            modifiedState: {
                ...(component.modifiedState ?? {}),
                [propKey]: {
                    value: updatedValue,
                }
            }
        }
        if (component.overriddenState && component.overriddenState[propKey]) {
            delete component.overriddenState[propKey]
        }
        return {
            components: {
                ...state.components,
                [componentId]: component,
            }
        }
    })
}

export const updateSelectedComponents = (updateFn: (state: any) => any) => {
    setMainStateStoreState(state => ({
        selectedComponents: updateFn(state.selectedComponents),
    }))
}

export const setSelectedComponents = (selected: {
    [id: string]: true,
}, replace: boolean = true) => {
    setMainStateStoreState(state => ({
        selectedComponents: replace ? selected : {
            ...state.selectedComponents,
            ...selected,
        }
    }))
}

export const setComponentsTree = (tree: TreeData) => {
    const componentsTree: MainStateStore['componentsTree'] = {}
    Object.values(tree.items).forEach(({id, children, isExpanded}) => {
        componentsTree[id] = {
            children: children as string[],
            isExpanded,
        }
    })
    setMainStateStoreState({
        componentsTree,
    })
}

export const setComponentTreeItemExpanded = (id: string, isExpanded: boolean) => {
    setMainStateStoreState(state => {
        return {
            componentsTree: {
                ...state.componentsTree,
                [id]: {
                    ...(state.componentsTree[id] ?? {
                        children: [],
                    }),
                    isExpanded,
                }
            }
        }
    })
}

export const addUnsavedComponent = (addable: Addable, parent: string, initialProps?: any) => {
    const id = generateUid()
    setMainStateStoreState(state => {
        return {
            unsavedComponents: {
                ...state.unsavedComponents,
                [id]: {
                    uid: id,
                    name: addable.name,
                    componentId: addable.id,
                    children: [],
                    isRoot: !parent,
                    initialProps: {
                        ...(addable.props ?? {}),
                        ...(initialProps ?? {})
                    },
                }
            }
        }
    })
    if (parent) {
        setComponentPropValue(parent, predefinedPropKeys.children, (state: string[]) => {
            state = state ? state : []
            return state.concat([id])
        })
    }
    return getCombinedId([parent, id])
}

const getGroupChildren = (groupId: string) => {
    const state = getMainStateStoreState()
    const groupChildren: string[] = []
    Object.entries(state.groupedComponents).forEach(([componentId, componentIdGroup]) => {
        if (componentIdGroup === groupId) {
            groupChildren.push(componentId)
        }
    })
    return groupChildren
}

export const deleteGroup = (id: string) => {
    const children = getGroupChildren(id)
    children.forEach(childId => {
        deleteComponent(childId)
    })
    setMainStateStoreState(state => {
        const updatedGroups = {
            ...state.groups,
        }
        delete updatedGroups[id]
        return {
            groups: updatedGroups
        }
    })
}

export const deleteComponent = (id: string) => {
    const state = getMainStateStoreState()
    if (state.groups[id]) {
        deleteGroup(id)
    } else if (state.unsavedComponents[id]) {
        deleteUnsavedComponent(id)
    } else {
        addDeactivatedComponent(id)
    }
    // todo - deselect deleted components
}


export const deleteSelectedComponents = () => {
    storeSnapshot()
    const selectedComponents = getMainStateStoreState().selectedComponents
    Object.keys(selectedComponents).forEach((component) => {
        deleteComponent(component)
    })
}

export const deleteUnsavedComponent = (id: string) => {
    setMainStateStoreState(state => {
        const updated = {
            ...state.unsavedComponents,
        }
        delete updated[id]
        return {
            unsavedComponents: updated,
        }
    })
}

export const addDeactivatedComponent = (id: string) => {
    setMainStateStoreState(state => {
        return {
            deactivatedComponents: {
                ...state.deactivatedComponents,
                [id]: true,
            }
        }
    })
}

export const removeDeactivatedComponents = (ids: string[]) => {
    setMainStateStoreState(state => {
        const updated = {
            ...state.deactivatedComponents,
        }
        ids.forEach((id) => {
            delete updated[id]
        })
        return {
            deactivatedComponents: updated,
        }
    })
}

export const groupComponents = (ids: string[], groupId?: string) => {
    let sameParent = true
    let currentParent = ''
    const groupedComponents = getMainStateStoreState().groupedComponents
    ids.forEach((id) => {
        const parentId = groupedComponents[id]
        if (parentId) {
            if (currentParent && currentParent !== parentId) {
                sameParent = false
            } else {
                currentParent = parentId
            }
        }
    })
    // @ts-ignore
    setMainStateStoreState(state => {
        const update: Partial<MainStateStore> = {
            groupedComponents: {
                ...(state.groupedComponents ?? {}),
            }
        }
        if (!groupId) {
            groupId = generateUid()
            update.groups = {
                ...(state.groups ?? {}),
                [groupId]: {
                    name: 'Group',
                    isExpanded: true,
                },
            }
        }
        if (sameParent) {
            // @ts-ignore
            update.groupedComponents[groupId] = currentParent
        }
        ids.forEach(id => {
            // @ts-ignore
            update.groupedComponents[id] = groupId
        })
        return update
    })
}

export const updateComponentLocation = (id: string, newDestination: string) => {
    if (newDestination === ROOT_ID) {
        setMainStateStoreState(state => {
            const update = {
                ...state.groupedComponents,
            }
            delete update[id]
            return {
                groupedComponents: update
            }
        })
    } else {
        const groups = getMainStateStoreState().groups
        if (groups[newDestination]) {
            groupComponents([id], newDestination)
        }
    }
}

export const setComponentName = (id: string, name: string) => {
    setMainStateStoreState(state => {
        return {
            componentNames: {
                ...state.componentNames,
                [id]: {
                    name,
                },
            }
        }
    })
}

export const setGroupName = (id: string, name: string) => {
    setMainStateStoreState(state => {
        return {
            groups: {
                ...state.groups,
                [id]: {
                    ...(state.groups[id] ?? {}),
                    name,
                }
            }
        }
    })
}

export const copySelectedComponents = () => {
    addToClipboard({
        type: PendingPasteType.COMPONENTS,
        data: getSelectedComponents(),
    })
}

const cloneComponentWithinState = (state: MainStateStore, componentId: string) => {
    const newId = generateUid()
    if (state.unsavedComponents[componentId]) {
        state.unsavedComponents = {
            ...state.unsavedComponents,
            [newId]: {
                ...state.unsavedComponents[componentId],
                uid: newId,
                children: [],
            },
        }
    }
    if (state.components[componentId]) {
        state.components = {
            ...state.components,
            [newId]: state.components[componentId],
        }
    }
    if (state.groupedComponents[componentId]) {
        state.groupedComponents = {
            ...state.groupedComponents,
            [newId]: state.groupedComponents[componentId],
        }
    }
    return newId
}

export const cloneComponents = (components: string[]) => {
    const newIds: string[] = []
    setMainStateStoreState(state => {
        const updatedState: any = {
            ...state,
        }
        components.forEach(componentId => {
            const id = cloneComponentWithinState(updatedState, componentId)
            newIds.push(id)
        })
        return updatedState
    })
    return newIds
}

const handlePasteComponents = (components: string[]) => {
    storeSnapshot()
    const addedComponents: {
        [key: string]: true
    } = {}
    const newIds = cloneComponents(components)
    newIds.forEach(componentId => {
        addedComponents[componentId] = true
    })
    setSelectedComponents(addedComponents)
}

export const handlePaste = () => {
    if (clipboardProxy.pendingPaste) {
        switch (clipboardProxy.pendingPaste.type) {
            case PendingPasteType.COMPONENTS:
                handlePasteComponents(Object.keys(clipboardProxy.pendingPaste.data))
                break;
            default:
                break;
        }
    }
    clearClipboard()
}