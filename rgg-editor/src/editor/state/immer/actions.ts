import {getStoreState, setStoreState} from "./immer";
import {StoreState} from "./types";
import {Addable} from "../../../scene/addables";
import {generateUid, getCombinedId} from "../../../utils/ids";
import {predefinedPropKeys} from "../../componentEditor/config";
import {storeSnapshot} from "../history/actions";
import {SceneTreeItem, StoredComponentState} from "../main/types";
import {addToClipboard, clearClipboard, clipboardProxy, PendingPasteType} from "../editor";
import {getSelectedComponents} from "./getters";
import {ExtendedTreeItem} from "../../sceneTree/useTreeData";

export const resetComponentProp = (componentId: string, propKey: string) => {
    setStoreState(draft => {
        const component = draft.components[componentId] ?? {}
        component.overriddenState = {
            ...(component.overriddenState ?? {}),
            [propKey]: true,
        }
        draft.components[componentId] = component
    })
}

export const setSharedComponentPropValue = (componentTypeId: string, propKey: string, propValue: any) => {

    setStoreState(draft => {
        const component = draft.sharedComponents[componentTypeId] ?? {}
        component.appliedState = {
            ...(component.appliedState ?? {}),
            [propKey]: {
                value: propValue,
            }
        }
        draft.sharedComponents[componentTypeId] = component
    })

}

export const setComponentPropValue = (componentId: string, propKey: string, propValue: any) => {

    setStoreState(draft => {
        const component = {
            ...(draft.components[componentId] ?? {}),
        }
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
        component.modifiedState = {
            ...(component.modifiedState ?? {}),
            [propKey]: {
                value: updatedValue,
            }
        }
        if (component.overriddenState && component.overriddenState[propKey]) {
            delete component.overriddenState[propKey]
        }
        draft.components[componentId] = component
    })

}

export const updateSelectedComponents = (updateFn: (state: StoreState['selectedComponents']) => StoreState['selectedComponents']) => {

    setStoreState(draft => {
        draft.selectedComponents = updateFn(draft.selectedComponents)
    })

}


export const deselectComponents = (components: string[]) => {

    setStoreState(draft => {
        components.forEach(componentId => {
            delete draft.selectedComponents[componentId]
        })
    })

}

export const setSelectedComponents = (components: string[], replace: boolean = true) => {
    setStoreState(draft => {
        if (replace) {
            draft.selectedComponents = Object.fromEntries(components.map(componentKey => ([componentKey, true])))
        } else {
            draft.selectedComponents = {
                ...draft.selectedComponents,
                ...(Object.fromEntries(components.map(componentKey => ([componentKey, true])))),
            }
        }
    })
}

export const setComponentTreeItemExpanded = (id: string, isExpanded: boolean) => {

    setStoreState(draft => {
        draft.componentsTree[id] = {
            ...(draft.componentsTree[id] ?? {
                children: [],
            }),
            isExpanded,
        }
    })

}

export const addUnsavedComponent = (addable: Addable, parent: string, initialProps?: any) => {
    const id = generateUid()

    setStoreState(draft => {
        draft.unsavedComponents[id] = {
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
    const state = getStoreState()
    const groupChildren: string[] = []
    Object.entries(state.groupedComponents).forEach(([componentId, componentIdGroup]) => {
        if (componentIdGroup === groupId) {
            groupChildren.push(componentId)
        }
    })
    return groupChildren
}

const draftDeleteGroup = (draft: StoreState, id: string) => {
    const children = getGroupChildren(id)
    children.forEach(childId => {
        deleteComponent(childId)
    })
    delete draft.groups[id]
}

export const deleteGroup = (id: string) => {
    setStoreState(draft => {
        draftDeleteGroup(draft, id)
    })
}

const draftDeleteUnsavedComponent = (draft: StoreState, id: string) => {
    delete draft.unsavedComponents[id]
    draft.unsavedComponents = {
        ...draft.unsavedComponents,
    }
}

export const deleteUnsavedComponent = (id: string) => {

    setStoreState(draft => {
        draftDeleteUnsavedComponent(draft, id)
    })

}

const draftAddDeactivatedComponent = (draft: StoreState, id: string) => {
    draft.deactivatedComponents[id] = true
    draft.deactivatedComponents = {
        ...draft.deactivatedComponents,
    }
}

export const addDeactivatedComponent = (id: string) => {

    setStoreState(draft => {
        draftAddDeactivatedComponent(draft, id)
    })

}

const draftDeleteComponent = (draft: StoreState, id: string) => {
    const state = getStoreState()
    if (state.groups[id]) {
        draftDeleteGroup(draft, id)
    } else if (state.unsavedComponents[id]) {
        draftDeleteUnsavedComponent(draft, id)
    } else {
        draftAddDeactivatedComponent(draft, id)
    }
}

export const deleteComponent = (id: string) => {

    setStoreState(draft => {
        draftDeleteComponent(draft, id)
    })

    // todo - deselect deleted components
}

export const deleteComponents = (ids: string[]) => {

    setStoreState(draft => {
        ids.forEach(id => {
            draftDeleteComponent(draft, id)
        })
    })

    // todo - deselect deleted components

}

export const deleteSelectedComponents = () => {
    storeSnapshot()
    const selectedComponents = getStoreState().selectedComponents
    deleteComponents(Object.keys(selectedComponents))
}

export const removeDeactivatedComponents = (ids: string[]) => {

    setStoreState(draft => {
        ids.forEach(id => {
            delete draft.deactivatedComponents[id]
        })
    })

}

export const groupComponents = (ids: string[], groupId?: string) => {
    let sameParent = true
    let currentParent = ''
    const groupedComponents = getStoreState().groupedComponents
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

    setStoreState(draft => {
        if (!groupId) {
            groupId = generateUid()
            draft.groups = {
                ...(draft.groups ?? {}),
                [groupId]: {
                    name: 'Group',
                    isExpanded: true,
                },
            }
        }
        if (sameParent) {
            draft.groupedComponents[groupId] = currentParent
        }
        ids.forEach(id => {
            draft.groupedComponents[id] = groupId as string
        })
    })

}

export const setComponentName = (id: string, name: string) => {

    setStoreState(draft => {
        draft.componentNames[id] = {
            name,
        }
    })

}

export const setGroupName = (id: string, name: string) => {

    setStoreState(draft => {
        draft.groups[id] = {
            ...(draft.groups[id] ?? {}),
            name,
        }
    })

}

export const copySelectedComponents = () => {
    addToClipboard({
        type: PendingPasteType.COMPONENTS,
        data: getSelectedComponents(),
    })
}

const getComponentPropValue = (component: StoredComponentState, propKey: string) => {
    const {modifiedState = {}} = component
    return modifiedState[propKey]
}

const draftCloneComponentWithinState = (draft: StoreState, componentId: string, componentIdWithParentId: string, parentId?: string) => {
    const rawId = generateUid()
    const newId = parentId ? getCombinedId([parentId, rawId]) : rawId
    const unsavedComponent = draft.unsavedComponents[componentId]
    if (unsavedComponent) {
        draft.unsavedComponents[rawId] = {
            ...unsavedComponent,
            uid: rawId,
            children: [],
        }
    }
    const component = draft.components[componentIdWithParentId]
    if (component) {
        draft.components[newId] = component
        const childrenProp = getComponentPropValue(component, predefinedPropKeys.children)
        if (childrenProp) {
            const {value: children = []} = childrenProp as {
                value: string[],
            }
            const newChildren: string[] = []
            children.forEach(childId => {
                newChildren.push(draftCloneComponentWithinState(draft, childId, getCombinedId([componentId, childId]), newId))
            })
            draft.components[newId] = {
                ...component,
                modifiedState: {
                    ...(component.modifiedState ?? {}),
                    [predefinedPropKeys.children]: {
                        value: newChildren,
                    }
                }

            }
        }
    }
    if (draft.groupedComponents[componentId]) {
        draft.groupedComponents[newId] = draft.groupedComponents[componentId]
    }
    return rawId
}

export const cloneComponents = (components: string[]) => {
    const newIds: string[] = []

    setStoreState(draft => {
        components.forEach(componentId => {
            const id = draftCloneComponentWithinState(draft, componentId, componentId)
            newIds.push(id)
        })
    })

    return newIds
}

const handlePasteComponents = (components: string[]) => {
    storeSnapshot()
    const newIds = cloneComponents(components)
    setSelectedComponents(newIds)
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

const mapExtendedTreeItemToSceneTreeItem = (data: ExtendedTreeItem): SceneTreeItem => {
    return {
        id: data.id,
        children: data.children ? (data.children as ExtendedTreeItem[]).map(mapExtendedTreeItemToSceneTreeItem) : [],
        expanded: data.expanded,
    }
}

export const convertTreeItemsToSceneTree = (data: ExtendedTreeItem[]) => {
    return data.map(mapExtendedTreeItemToSceneTreeItem)
}

export const setSceneTree = (data: ExtendedTreeItem[]) => {
    const sceneTree: SceneTreeItem[] = convertTreeItemsToSceneTree(data)
    setStoreState(draft => {
        draft.sceneTree = sceneTree
    })
}

export const setComponentVisibility = (id: string, visible: boolean) => {

    setStoreState(draft => {
        draft.componentsVisibility[id] = visible
    })

}
