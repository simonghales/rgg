import React, {useCallback, useEffect, useMemo, useRef} from "react";
import SortableTree, {
    ExtendedNodeData,
    FullTree,
    NodeData,
    OnMovePreviousAndNextLocation,
    TreeItem
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { styled } from "../ui/sitches.config";
import {SceneNodeRenderer} from "./SceneNodeRenderer";
import {ExtendedTreeItem, useTreeData} from "./useTreeData";
import {isEqual, sortBy} from "lodash-es";
import {groupComponents, setSceneTree, setSelectedComponents} from "../state/main/actions";
import { Context } from "./SceneTreeView.context";
import {sceneTreeViewState} from "./SceneTreeView.state";
import {storeSnapshot} from "../state/history/actions";

const canNodeHaveChildren = (node: any) => {
    return node.canHaveChildren ?? false
}

const canDrag = (data: ExtendedNodeData) => {
    return data.node.canDrag ?? true
}

const findTreeNode = (id: string, data: TreeItem[]): TreeItem | undefined => {
    let matchedNode: TreeItem | undefined = undefined
    for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].id === id) {
            return data[i]
        }
        if (data[i].children) {
            const childNode = findTreeNode(id, data[i].children as TreeItem[])
            if (childNode) {
                return childNode
            }
        }
    }
    return matchedNode
}

const checkIfTreeIsValid = (data: TreeItem[]) => {
    let valid = true
    data.forEach(node => {
        if (node.children && node.children.length > 0 && !node.canHaveChildren) {
            if (node.directChildren) {
                const children = (node.children as TreeItem[]).map(child => child.id)
                if (isEqual(sortBy(children), sortBy(node.directChildren))) {
                    return
                }
            }
            valid = false
        }
    })
    return valid
}

const StyledContainer = styled('div', {
    height: '100%',
    '.rst__tree > div': {
        height: '100% !important',
        width: '100% !important',
    },
    '.rst__lineBlock, .rst__absoluteLineBlock, .rst__lineChildren': {
        display: 'none',
    },
    '.rst__nodeContent': {
        right: 0,
        overflow: 'hidden',
    }
})

export const SceneTreeView: React.FC = () => {

    const [data, setData] = useTreeData()

    const {
        onMoveNode,
        onChange,
    } = useMemo(() => ({
        onMoveNode: (data: NodeData & FullTree & OnMovePreviousAndNextLocation) => {

            const parentPath = data.prevPath.length > 1 ? data.prevPath[data.prevPath.length - 2] : ''
            const nextParentPath = data.nextPath.length > 1 ? data.nextPath[data.nextPath.length - 2] : ''

            if (parentPath === nextParentPath) {
                return
            }

            if (data.nextParentNode) {
                const id = data.nextParentNode.id
                groupComponents([data.node.id], id)
            } else {
                // remove from previous group
            }
        },
        onChange: (updatedData: TreeItem[]) => {

            storeSnapshot()

            if (!checkIfTreeIsValid(updatedData)) {
                console.warn('Invalid tree.')
                return
            }
            setData(updatedData)
            setSceneTree(updatedData as ExtendedTreeItem[])
        },
    }), [setData])

    const selectComponentsInRange = useCallback((id: string, treeIndex: number) => {
        const range: string[] = []
        const addToRange = (item: ExtendedTreeItem) => {
            range.push(item.id)
            if (item.children) {
                (item.children as ExtendedTreeItem[]).forEach(addToRange)
            }
        }
        (data as ExtendedTreeItem[]).forEach(addToRange)
        const lastSelectedIndex = range.indexOf(sceneTreeViewState.lastSelected)
        if (lastSelectedIndex === -1) {
            // todo - handle
            return
        }
        let lowest = treeIndex
        let highest = lastSelectedIndex
        if (treeIndex > lastSelectedIndex) {
            highest = treeIndex
            lowest = lastSelectedIndex
        }

        const selected = range.slice(lowest, highest + 1)
        const selectedObj: Record<string, true> = {}

        selected.forEach(id => {
            selectedObj[id] = true
        })

        setSelectedComponents(selectedObj)
    }, [data])

    const selectComponentsInRangeRef = useRef(selectComponentsInRange)

    useEffect(() => {
        selectComponentsInRangeRef.current = selectComponentsInRange
    }, [selectComponentsInRange])

    return (
        <Context.Provider value={{
            selectComponentsInRangeRef,
        }}>
            <StyledContainer>
                <SortableTree treeData={data} onChange={onChange} canDrag={canDrag}
                              rowHeight={34} scaffoldBlockPxWidth={8}
                              nodeContentRenderer={SceneNodeRenderer} canNodeHaveChildren={canNodeHaveChildren}
                              onMoveNode={onMoveNode}
                />
            </StyledContainer>
        </Context.Provider>
    );
};