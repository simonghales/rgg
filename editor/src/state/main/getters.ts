import {useStateStore} from "./store";
import {ComponentsStore, useComponentsStore} from "../components/components";
import {SidebarItem, StateStore} from "./types";
import {useEditorStore} from "../editor";

export const getSelectedComponent = () => {
    return useStateStore.getState().selectedComponent
}

export const getSelectedComponents = () => {
    const selectedComponents = useStateStore.getState().selectedComponents
    return Object.entries(selectedComponents).filter(([, selected]) => selected).map(([key]) => key)
}

export const getComponent = (uid: string) => {
    return useStateStore.getState().components[uid] ?? {
        modifiedState: {}
    }
}

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

export const computeSidebarItems = (
    components: ComponentsStore['components'],
    groupedComponents: StateStore['groupedComponents'],
    groups: StateStore['groups'],
): SidebarItem[] => {

    const items: SidebarItem[] = []
    const itemGroups: {
        [key: string]: {
            [key: string]: true,
        }
    } = {}

    Object.entries(components).forEach(([key, component]) => {
        const groupKey = groupedComponents[key]
        if (groupKey && groups[groupKey]) {
            if (itemGroups[groupKey]) {
                itemGroups[groupKey][key] = true
            } else {
                itemGroups[groupKey] = {
                    [key]: true,
                }
            }
        } else if (component.isRoot) {
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
    const {groupedComponents, groups} = useStateStore.getState()
    const components = useComponentsStore.getState().components
    return computeSidebarItems(components, groupedComponents, groups)
}

export const getParentGroup = (componentId: string): string => {
    const {
        groupedComponents
    } = useStateStore.getState()
    return groupedComponents[componentId] ?? ''
}

export const isComponentUnsaved = (componentId: string) => {
    return !!useStateStore.getState().unsavedComponents[componentId]
}

export const getUnsavedComponent = (componentId: string) => {
    return useStateStore.getState().unsavedComponents[componentId]
}

export const getUnsavedComponentInitialProps = (componentId: string) => {
    const unsavedComponent = getUnsavedComponent(componentId)
    return unsavedComponent?.initialProps ?? {}
}

export const getComponentState = (componentId: string) => {
    return useEditorStore.getState().activeComponentState[componentId]
}