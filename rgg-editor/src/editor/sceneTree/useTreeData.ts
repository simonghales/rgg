import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {TreeItem} from "react-sortable-tree";
import useThrottledEffect from "use-throttled-effect";
import {componentsSelector, useComponentsStore, useComponentsThatCanHaveChildren} from "../state/components/store";
import {ComponentState} from "../state/components/types";
import {useMainStateStore} from "../state/immer/immer";
import {SceneTreeItem} from "../state/main/types";
import {groupedComponentsSelector, sceneTreeSelector} from "../state/immer/selectors";

export interface ExtendedTreeItem extends TreeItem {
    id: string,
    isGroup?: boolean,
    canHaveChildren?: boolean,
    directChildren?: string[],
    restrictedParent?: string,
}

type Item = {
    id: string,
    children: Item[],
    isGroup?: boolean,
    directChildren?: string[],
    restrictedParent?: string,
    canHaveChildren?: boolean,
}

const getItem = (component: ComponentState, components: Record<string, ComponentState>, componentsThatCanHaveChildren: Record<string, boolean>): Item => {
    const children: Item[] = []
    component.children.forEach(childId => {
        const child = components[childId]
        if (child) {
            children.push(getItem(child, components, componentsThatCanHaveChildren))
        }
    })
    return {
        id: component.uid,
        children,
        directChildren: children.map(child => child.id),
        restrictedParent: !component.unsaved ? component.parentId : '',
        canHaveChildren: componentsThatCanHaveChildren[component.uid],
    }
}

const mapItemToTreeItem = (item: Item): ExtendedTreeItem => {
    return {
        id: item.id,
        children: item.children.map(child => mapItemToTreeItem(child)),
        expanded: true,
        isGroup: item.isGroup,
        canHaveChildren: !!item.isGroup || item.canHaveChildren,
        directChildren: item.directChildren,
        restrictedParent: item.restrictedParent,
    }
}


const getFlatAllItems = (sceneTree: SceneTreeItem[]) => {
    const allItems: string[] = []
    const addItem = (item: SceneTreeItem) => {
        allItems.push(item.id)
        if (item.children) {
            item.children.forEach(addItem)
        }
    }
    sceneTree.forEach(addItem)
    return allItems
}

const getFlatAllItemsMap = (sceneTree: SceneTreeItem[]) => {
    const allItemsMap: Record<string, SceneTreeItem> = {}
    const addItem = (item: SceneTreeItem) => {
        allItemsMap[item.id] = item
        if (item.children) {
            item.children.forEach(addItem)
        }
    }
    sceneTree.forEach(addItem)
    return allItemsMap
}

const useSceneTreeData = (): TreeItem[] => {

    const components = useComponentsStore(componentsSelector)
    const componentsThatCanHaveChildren = useComponentsThatCanHaveChildren()
    const groupedComponents = useMainStateStore(groupedComponentsSelector)
    const sceneTree = useMainStateStore(sceneTreeSelector)
    const [storedSceneTree, setStoredSceneTree] = useState(sceneTree)
    const sceneTreeRef = useRef(sceneTree)

    useEffect(() => {
        sceneTreeRef.current = sceneTree
        setStoredSceneTree(state => {
            if (state.length > 0) return state
            return sceneTree
        })
    }, [sceneTree])

    const items = useMemo(() => {
        const items: Record<string, Item> = {}

        Object.values(components).forEach(component => {
            if (component.isRoot) {
                items[component.uid] = getItem(component, components, componentsThatCanHaveChildren)
            }
        })

        return Object.values(items)
    }, [components, componentsThatCanHaveChildren])

    const groupedItems = useMemo(() => {
        const finalItems: Item[] = []
        const groupItems: Record<string, Item> = {}
        items.forEach(item => {
            const groupId = groupedComponents[item.id]
            if (groupId) {
                const group = groupItems[groupId]
                if (group) {
                    groupItems[groupId] = {
                        ...group,
                        children: group.children.concat([item])
                    }
                } else {
                    groupItems[groupId] = {
                        id: groupId,
                        children: [item],
                        isGroup: true,
                    }
                }
            } else {
                finalItems.push(item)
            }
        })
        return finalItems.concat(Object.values(groupItems))
    }, [items, groupedComponents])

    return useMemo(() => {
        const finalItems: ExtendedTreeItem[] = []
        groupedItems.forEach(item => {
            finalItems.push(mapItemToTreeItem(item))
        })
        const allItems = getFlatAllItems(sceneTreeRef.current)
        const allItemsMap = getFlatAllItemsMap(sceneTreeRef.current)

        const sortItems = (itemA: ExtendedTreeItem, itemB: ExtendedTreeItem) => {
            return allItems.indexOf(itemA.id) - allItems.indexOf(itemB.id)
        }

        const sortItemChildren = (item: ExtendedTreeItem) => {
            if (item.children) {
                (item.children as ExtendedTreeItem[]).sort(sortItems);
                (item.children as ExtendedTreeItem[]).forEach(sortItemChildren);
            }
        }

        finalItems.sort(sortItems)
        finalItems.forEach(sortItemChildren)

        const updateData = (item: ExtendedTreeItem) => {
            if (allItemsMap[item.id]) {
                item.expanded = allItemsMap[item.id].expanded
            }
            if (item.children) {
                (item.children as ExtendedTreeItem[]).forEach(updateData)
            }
        }
        finalItems.forEach(updateData)
        return finalItems
    }, [groupedItems, storedSceneTree])
}

export const useTreeData = () => {

    const treeData = useSceneTreeData()

    const [data, setData] = useState<TreeItem[]>(treeData)

    useThrottledEffect(() => {
        setData(treeData)
    }, 100, [treeData])

    return [data, setData] as [TreeItem[], Dispatch<SetStateAction<TreeItem[]>>]
}
