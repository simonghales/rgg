import React, {useMemo} from "react";
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
import {groupComponents, setSceneTree} from "../state/main/actions";

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
            console.log('data', data)

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
            if (!checkIfTreeIsValid(updatedData)) {
                console.warn('Invalid tree.')
                return
            }
            setData(updatedData)
            setSceneTree(updatedData as ExtendedTreeItem[])
        }
    }), [setData])

    return (
        <StyledContainer>
            <SortableTree treeData={data} onChange={onChange} canDrag={canDrag}
                          rowHeight={32} scaffoldBlockPxWidth={8}
                          nodeContentRenderer={SceneNodeRenderer} canNodeHaveChildren={canNodeHaveChildren}
                          onMoveNode={onMoveNode}
            />
        </StyledContainer>
    );
};