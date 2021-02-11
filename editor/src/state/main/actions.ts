import {revertState, useStateStore} from "./store";
import FileSaver from "file-saver";
import {ComponentGroup, GroupedComponents, StateStore} from "./types";
import {Creatable} from "../creatables";
import {ComponentState} from "../types";
import {generateUuid} from "../../utils/ids";
import {getComponent, getSelectedComponents, isComponentUnsaved} from "./getters";
import {storeSnapshot} from "../history/actions";
import {editorStateProxy} from "../editor";

export const discardChanges = () => {
    storeSnapshot()
    useStateStore.setState(revertState)
}

export const loadState = (state: StateStore) => {
    useStateStore.setState(state)
}

export const saveChanges = () => {

    const file = new File([JSON.stringify(useStateStore.getState())], "data.json", {type: "application/json"});
    FileSaver.saveAs(file);

}

export const setGroupIsOpen = (uid: string, isOpen: boolean) => {
    useStateStore.setState(state => ({
        groups: {
            ...state.groups,
            [uid]: {
                ...state.groups[uid],
                isOpen,
            }
        }
    }))
}

export const addDeactivatedComponent = (uid: string) => {
    storeSnapshot()
    useStateStore.setState(state => ({
        deactivatedComponents: {
            ...state.deactivatedComponents,
            [uid]: true,
        }
    }))
}

export const removeDeactivatedComponent = (uid: string) => {
    storeSnapshot()
    useStateStore.setState(state => {
        const update = {
            ...state.deactivatedComponents,
        }
        delete update[uid]
        return {
            deactivatedComponents: update
        }
    })
}

export const setSelectedComponents = (components: string[]) => {
    const selectedComponents: {
        [key: string]: boolean,
    } = {}
    components.forEach((uid) => {
        selectedComponents[uid] = true
    })
    useStateStore.setState({
        selectedComponents: selectedComponents,
    })
}

export const setSelectedComponent = (selected: boolean, uid: string, override: boolean = true) => {
    useStateStore.setState(state => {
        if (override) {
            if (selected) {
                return {
                    selectedComponent: uid,
                    selectedComponents: {
                        [uid]: true,
                    }
                }
            } else {
                return {
                    selectedComponent: '',
                    selectedComponents: {},
                }
            }
        }
        if (selected) {
            return {
                selectedComponents: {
                    ...state.selectedComponents,
                    [uid]: selected
                }
            }
        } else {
            const updated = {
                ...state.selectedComponents,
            }
            delete updated[uid]
            return {
                selectedComponents: updated
            }
        }
    })
}

export const updateComponentModifiedState = (uid: string, key: string, value: any) => {
    storeSnapshot()
    const component = getComponent(uid)
    useStateStore.setState(state => {
        return {
            components: {
                ...state.components,
                [uid]: {
                    ...component,
                    modifiedState: {
                        ...component.modifiedState,
                        [key]: {
                            value,
                        }
                    }
                }
            },
        }
    })
}

export const removeUnsavedComponent = (uid: string) => {
    storeSnapshot()
    useStateStore.setState(state => {
        const component = state.unsavedComponents[uid]
        if (!component) return {}
        const updatedComponents = {
            ...state.unsavedComponents,
        }
        delete updatedComponents[uid]
        return {
            unsavedComponents: updatedComponents
        }
    })
}

export const addNewUnsavedComponent = (creatable: Creatable, initialProps: {
    [key: string]: any,
} = {}, copiedFromId?: string): ComponentState => {
    storeSnapshot()
    const component: ComponentState = {
        uid: generateUuid(),
        name: creatable.name,
        children: [],
        isRoot: true,
        componentType: creatable.uid,
        initialProps,
    }
    useStateStore.setState(state => {
        const update: Partial<StateStore> = {
            unsavedComponents: {
                ...state.unsavedComponents,
                [component.uid]: component,
            }
        }
        if (copiedFromId) {
            update.components = {
                ...state.components,
                [component.uid]: {
                    ...(state.components[copiedFromId] ?? {})
                }
            }
        }
        return update
    })
    return component
}

export const addComponentsToGroup = (componentIds: string[], groupId: string) => {
    useStateStore.setState(state => {
        const groupedComponents = {
            ...state.groupedComponents,
        }
        componentIds.forEach((componentId) => {
            groupedComponents[componentId] = groupId
        })
        return {
            groupedComponents,
        }
    })
}

export const groupSelectedComponents = () => {
    const selectedComponents = getSelectedComponents()

    const groupId = generateUuid()

    const newGroup: ComponentGroup = {
        parent: '',
        isOpen: true,
        components: {},
    }
    const groupedComponents: GroupedComponents = {}

    selectedComponents.forEach((componentId) => {
        newGroup.components[componentId] = true
        groupedComponents[componentId] = groupId
    })

    useStateStore.setState(state => {
        return {
            groups: {
                ...state.groups,
                [groupId]: newGroup,
            },
            groupedComponents: {
                ...state.groupedComponents,
                ...groupedComponents,
            }
        }
    })

}

export const removeGroup = (groupId: string) => {
    return useStateStore.setState(state => {
        const updatedGroupedComponents = {
            ...state.groupedComponents,
        }
        const updatedGroups = {
            ...state.groups,
        }

        Object.entries(updatedGroupedComponents).forEach(([componentId, componentGroupId]) => {
            if (componentGroupId === groupId) {
                delete updatedGroupedComponents[componentId]
            }
        })

        delete updatedGroups[groupId]

        return {
            groupedComponents: updatedGroupedComponents,
            groups: updatedGroups,
        }
    })
}

export const closeAddingComponent = () => {
    editorStateProxy.addComponentKey = ''
}

export const deleteComponent = (componentId: string) => {
    if (isComponentUnsaved(componentId)) {
        removeUnsavedComponent(componentId)
    } else {
        addDeactivatedComponent(componentId)
    }
}

export const deleteSelectedComponents = () => {
    const selectedComponents = getSelectedComponents()
    selectedComponents.forEach((componentId) => {
        deleteComponent(componentId)
    })
}

export const ungroupComponents = (componentIds: string[]) => {
    useStateStore.setState(state => {
        const groupedComponents = {
            ...state.groupedComponents,
        }
        componentIds.forEach((componentId) => {
            delete groupedComponents[componentId]
        })
        return {
            groupedComponents,
        }
    })
}

export const updateComponentName = (componentId: string, name: string) => {
    storeSnapshot()
    useStateStore.setState(state => {
        return {
             componentNames: {
                 ...state.componentNames,
                 [componentId]: name,
             }
        }
    })
}