import {getMainStateStoreState, setMainStateStoreState} from "./store";
import {TreeData} from "@atlaskit/tree";
import {MainStateStore} from "./types";
import {Addable} from "../../../scene/addables";
import {generateUid, getCombinedId} from "../../../utils/ids";
import {predefinedPropKeys} from "../../componentEditor/config";
import {ROOT_ID} from "../../SceneList";

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

export const addUnsavedComponent = (addable: Addable, parent: string) => {
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
                    initialProps: addable.props,
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

export const deleteComponent = (id: string) => {
    if (getMainStateStoreState().unsavedComponents[id]) {
        deleteUnsavedComponent(id)
    } else {
        addDeactivatedComponent(id)
    }
}

export const deleteSelectedComponents = () => {
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