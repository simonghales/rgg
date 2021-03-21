import React, {useState} from "react";
import SortableTree, {TreeItem} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { styled } from "../ui/sitches.config";
import {SceneNodeRenderer} from "./SceneNodeRenderer";

const treeData: TreeItem[] = [
    {
        id: 'a',
        expanded: true,
        children: [{
            id: 'b',
        }],
    },
    {
        id: 'c',
    }
]

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

    const [data, setData] = useState(treeData)

    return (
        <StyledContainer>
            <SortableTree treeData={data} onChange={setData} rowHeight={32} scaffoldBlockPxWidth={16}
                          nodeContentRenderer={SceneNodeRenderer}/>
        </StyledContainer>
    );
};