import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {TreeItem} from "react-sortable-tree";
import {componentsSelector, useComponentsStore} from "../state/components/store";
import {ComponentState} from "../state/components/types";
import {useMainStateStore} from "../state/main/store";
import {SceneTreeItem} from "../state/main/types";

export interface ExtendedTreeItem extends TreeItem {
    id: string,
    isGroup?: boolean,
    canHaveChildren?: boolean,
    directChildren?: string[],
}

type Item = {
    id: string,
    children: Item[],
    isGroup?: boolean,
    directChildren?: string[],
}

const getItem = (component: ComponentState, components: Record<string, ComponentState>): Item => {
    const children: Item[] = []
    component.children.forEach(childId => {
        const child = components[childId]
        if (child) {
            children.push(getItem(child, components))
        }
    })
    return {
        id: component.uid,
        children,
        directChildren: children.map(child => child.id),
    }
}

const mapItemToTreeItem = (item: Item): ExtendedTreeItem => {
    return {
        id: item.id,
        children: item.children.map(child => mapItemToTreeItem(child)),
        expanded: true,
        isGroup: item.isGroup,
        canHaveChildren: !!item.isGroup,
        directChildren: item.directChildren,
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
    const groupedComponents = useMainStateStore(state => state.groupedComponents)
    const sceneTree = useMainStateStore(state => state.sceneTree)
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
                items[component.uid] = getItem(component, components)
            }
        })

        return Object.values(items)
    }, [components])

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

    useEffect(() => {
        setData(treeData)
    }, [treeData])

    return [data, setData] as [TreeItem[], Dispatch<SetStateAction<TreeItem[]>>]
}