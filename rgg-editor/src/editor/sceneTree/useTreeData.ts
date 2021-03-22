import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {TreeItem} from "react-sortable-tree";
import {componentsSelector, useComponentsStore} from "../state/components/store";
import {ComponentState} from "../state/components/types";
import {useMainStateStore} from "../state/main/store";

type Item = {
    id: string,
    children: Item[],
    isGroup?: boolean,
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
    }
}

const mapItemToTreeItem = (item: Item): TreeItem => {
    return {
        id: item.id,
        children: item.children.map(child => mapItemToTreeItem(child)),
        expanded: true,
        isGroup: item.isGroup,
    }
}


const useSceneTreeData = (): TreeItem[] => {

    const components = useComponentsStore(componentsSelector)
    const groupedComponents = useMainStateStore(state => state.groupedComponents)

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
        const finalItems: TreeItem[] = []
        groupedItems.forEach(item => {
            finalItems.push(mapItemToTreeItem(item))
        })
        return finalItems
    }, [groupedItems])
}

export const useTreeData = () => {

    const treeData = useSceneTreeData()

    const [data, setData] = useState<TreeItem[]>(treeData)

    useEffect(() => {
        setData(treeData)
    }, [treeData])

    return [data, setData] as [TreeItem[], Dispatch<SetStateAction<TreeItem[]>>]
}