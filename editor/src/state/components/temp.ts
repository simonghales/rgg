import {ComponentsStore, useComponentsStore} from "./components";
import {
    ComponentGroup, ComponentsStateStore,
    getSelectedComponent,
    getSelectedComponents,
    GroupedComponents,
    useComponentsStateStore
} from "./componentsState";
import {generateUuid} from "../../utils/ids";
import {editorStateProxy} from "../editor";

const findGroup = (groupId: string, sidebarItems: SidebarItem[]): SidebarItem | null => {
    for (let i = 0, len = sidebarItems.length; i < len; i++) {
        const item = sidebarItems[i]
        if (item.key === groupId) {
            return item
        } else if (item.children) {
            const match = findGroup(groupId, item.children)
            if (match) {
                return match
            }
        }
    }
    return null
}

export const calculateNewSelectedComponents = (newSelectedIndex: number, uid: string, parentGroupId: string): string[] => {

    // const rootList = getComponentsRootList().map(({uid}) => uid)


    const sidebarItems = getSidebarItems()
    let rootList = sidebarItems.map(item => item.key)

    if (parentGroupId) {
        const group = findGroup(parentGroupId, sidebarItems)
        const groupChildrenKeys = group?.children?.map(({key}) => key) || []
        if (!group || !groupChildrenKeys.includes(uid)) {
            return [uid]
        } else {
            rootList = groupChildrenKeys
        }
    }

    const selectedComponents = getSelectedComponents()

    const selectedIndexes: number[] = []

    selectedComponents.forEach((componentUid) => {
        const index = rootList.indexOf(componentUid)
        selectedIndexes.push(index)
    })

    selectedIndexes.sort()

    if (selectedIndexes.length === 0) {
        return [uid]
    }

    if (selectedIndexes.length === 1) {
        const range = selectedIndexes[0]
        if (newSelectedIndex > range) {
            const selectedRange = rootList.slice(range, newSelectedIndex + 1)
            return selectedRange
        } else {
            const selectedRange = rootList.slice(newSelectedIndex, range + 1)
            return selectedRange
        }
    }

    const originalSelection = getSelectedComponent()

    if (!originalSelection) {
        return [uid]
    }

    const originalIndex = rootList.indexOf(originalSelection)

    if (newSelectedIndex > originalIndex) {
        const selectedRange = rootList.slice(originalIndex, newSelectedIndex + 1)
        return selectedRange
    } else {
        const selectedRange = rootList.slice(newSelectedIndex, originalIndex + 1)
        return selectedRange
    }

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

    useComponentsStateStore.setState(state => {
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

/*


[
item,
item,
group,
item,
item,
]

 */

export type SidebarItem = {
    key: string,
    type: 'component' | 'group',
    children?: SidebarItem[],
}

const computeSidebarItems = (
    components: ComponentsStore['components'],
    groupedComponents: ComponentsStateStore['groupedComponents'],
    groups: ComponentsStateStore['groups'],
    ): SidebarItem[] => {

    const items: SidebarItem[] = []
    const itemGroups: {
        [key: string]: {
            [key: string]: true,
        }
    } = {}

    Object.entries(components).forEach(([key]) => {
        const groupKey = groupedComponents[key]
        if (groupKey && groups[groupKey]) {
            if (itemGroups[groupKey]) {
                itemGroups[groupKey][key] = true
            } else {
                itemGroups[groupKey] = {
                    [key]: true,
                }
            }
        } else {
            items.push({
                key,
                type: 'component',
            })
        }
    })
    Object.entries(itemGroups).forEach(([key, group]) => {
        items.push({
            key,
            type: 'group',
            children: Object.keys(group).map((componentKey) => ({
                key: componentKey,
                type: 'component',
            }))
        })
    })
    return items
}

export const getSidebarItems = () => {
    const {groupedComponents, groups} = useComponentsStateStore.getState()
    const components = useComponentsStore.getState().components
    return computeSidebarItems(components, groupedComponents, groups)
}

export const useSidebarItems = (): SidebarItem[] => {
    const {groupedComponents, groups} = useComponentsStateStore(state => ({
        groupedComponents: state.groupedComponents,
        groups: state.groups,
    }))
    const {components} = useComponentsStore(state => ({
        components: state.components,
    }))
    return computeSidebarItems(components, groupedComponents, groups)
}

export const removeGroup = (groupId: string) => {
    return useComponentsStateStore.setState(state => {
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

export const getParentGroup = (componentId: string): string => {
    const {
        groupedComponents
    } = useComponentsStateStore.getState()
    return groupedComponents[componentId] ?? ''
}

export const closeAddingComponent = () => {
    editorStateProxy.addComponentKey = ''
}