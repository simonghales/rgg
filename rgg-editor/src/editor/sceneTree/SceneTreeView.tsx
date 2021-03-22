import React, {useMemo} from "react";
import SortableTree, {ExtendedNodeData, TreeItem} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { styled } from "../ui/sitches.config";
import {SceneNodeRenderer} from "./SceneNodeRenderer";
import {useTreeData} from "./useTreeData";

const canNodeHaveChildren = (node: any) => {
    return node.canHaveChildren ?? false
}

const canDrag = (data: ExtendedNodeData) => {
    return data.node.canDrag ?? true
}

const checkIfTreeIsValid = (data: TreeItem[]) => {
    let valid = true
    data.forEach(node => {
        if (node.children && node.children.length > 0 && !node.canHaveChildren) {
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
        onChange,
    } = useMemo(() => ({
        onChange: (updatedData: TreeItem[]) => {
            if (!checkIfTreeIsValid(updatedData)) {
                return
            }
            setData(updatedData)
        }
    }), [setData])

    return (
        <StyledContainer>
            <SortableTree treeData={data} onChange={onChange} canDrag={canDrag} rowHeight={32} scaffoldBlockPxWidth={8}
                          nodeContentRenderer={SceneNodeRenderer} canNodeHaveChildren={canNodeHaveChildren}/>
        </StyledContainer>
    );
};