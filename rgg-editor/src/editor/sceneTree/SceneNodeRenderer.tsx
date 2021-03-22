import React, {useEffect, useMemo, useRef} from "react";
import {NodeRendererProps} from "react-sortable-tree";
import {ScreenTreeNode} from "./ScreenTreeNode";

interface Props extends NodeRendererProps

export const SceneNodeRenderer: React.FC<Props> = ({
                                                       node,
                                                       path,
                                                       connectDragSource,
                                                       connectDragPreview,
                                                       didDrop,
                                                       isDragging,
                                                       toggleChildrenVisibility,
                                                       treeIndex,
                                                        canDrag,
                                                   }) => {

    const {id} = node

    const {
        onIconClick,
    } = useMemo(() => ({
        onIconClick: () => {
            if (toggleChildrenVisibility &&
                node.children &&
                node.children.length > 0) {
                toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                })
            }
        }
    }), [toggleChildrenVisibility, node, path, treeIndex])

    const onIconClickRef = useRef(onIconClick)

    useEffect(() => {
        onIconClickRef.current = onIconClick
    }, [onIconClick])

    const isLandingPadActive = !didDrop && isDragging;

    const hasChildren = (node.children && node.children.length > 0)

    const expanded = node.expanded ?? false

    const isGroup = node.isGroup ?? false

    return (
        <div>
            {
                connectDragPreview(
                    <div>
                        <ScreenTreeNode canDrag={canDrag} expanded={expanded} isGroup={isGroup} treeIndex={treeIndex}
                                        hasChildren={hasChildren ?? false} onIconClickRef={onIconClickRef}
                                        connectDragSource={connectDragSource} id={id}
                                        isLandingPadActive={isLandingPadActive} key={id}/>
                    </div>
                )
            }
        </div>
    );

};