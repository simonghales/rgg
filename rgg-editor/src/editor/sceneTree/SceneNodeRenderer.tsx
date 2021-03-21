import React, {useMemo} from "react";
import {isDescendant, NodeRendererProps} from "react-sortable-tree";
import { styled } from "../ui/sitches.config";

interface Props extends NodeRendererProps

const StyledWrapper = styled('div', {
})

const StyledContainer = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
})

const StyledGrabHandle = styled('div', {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
})

const StyledNameWrapper = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: '$1b',
})

export const SceneNodeRenderer: React.FC<Props> = ({
                                                       node,
                                                       connectDragSource,
                                                        connectDragPreview,
                                                       canDrag,
    draggedNode,
    didDrop,
    isDragging,
                                                       path,
                                                   }) => {

    console.log('path', path, node)

    const handle = useMemo(() => {
        return connectDragSource(
            <div className="dragHandle">
                <StyledGrabHandle/>
            </div>, {
            dropEffect: 'copy',
        });
    }, [canDrag, node])

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    return (
        <StyledWrapper>
            {
                connectDragPreview(
                    <div>
                        <StyledContainer>
                            {handle}
                            <StyledNameWrapper>
                                <div>
                                    NAME: {node.id} TESTING TESTING TESTING TESTING
                                </div>
                                <div>
                                    Toggle...
                                </div>
                            </StyledNameWrapper>
                        </StyledContainer>
                    </div>
                )
            }
        </StyledWrapper>
    );
};