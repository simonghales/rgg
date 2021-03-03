// @ts-nocheck
import React, {useMemo, useState} from "react"
import Tree, {
    mutateTree,
    moveItemOnTree,
    RenderItemParams,
    TreeData,
    ItemId,
    TreeSourcePosition,
    TreeDestinationPosition,
} from '@atlaskit/tree';
import {styled} from "./ui/sitches.config"
import {FaFolder, FaFolderOpen, FaCube, FaTrash} from "react-icons/fa";

enum TreeItemType {
    group = 'group',
    component = 'component',
}

enum SceneItemIcon {
    group = 'group',
    groupClosed = 'groupClosed',
    component = 'component'
}

const useSceneTree = (): TreeData => {
    return useState<TreeData>({
        rootId: 'root',
        items: {
            'root': {
                id: 'root',
                children: [
                    '0',
                    '1',
                ],
            },
            '0': {
                id: '0',
                children: [],
                data: {
                    title: 'Test',
                    type: TreeItemType.component,
                }
            },
            '1': {
                id: '1',
                children: ['2'],
                data: {
                    title: 'Test 2',
                    type: TreeItemType.group,
                },
                isExpanded: true,
            },
            '2': {
                id: '2',
                children: [],
                data: {
                    title: 'Component',
                    type: TreeItemType.component,
                }
            },
        }
    })
}

const ItemIcon: React.FC<{
    iconType: SceneItemIcon
}> = ({iconType}) => {
    if (iconType === SceneItemIcon.group) {
        return <FaFolderOpen size={11}/>
    } else if (iconType === SceneItemIcon.groupClosed) {
        return <FaFolder size={11}/>
    }
    return <FaCube size={11}/>
}

const sidePadding = 12

const StyledChildrenContainer = styled('div', {
    paddingLeft: `${sidePadding}px`,
})

const SceneChildren: React.FC<{
    id: string,
}> = ({id}) => {
    if (id !== '2') return null
    return (
        <StyledChildrenContainer>
            <SceneItem id="test" icon={<ItemIcon iconType={SceneItemIcon.component}/>} draggable={false}>
                Child goes here...
            </SceneItem>
        </StyledChildrenContainer>
    )
}

const StyledDraggableContainer = styled('div', {
    padding: '1px $1b',
})

export const StyledButton = styled('button', {
    padding: 0,
    margin: 0,
    border: 0,
    font: 'inherit',
    color: 'inherit',
    backgroundColor: 'transparent',
})

const StyledClickable = styled(StyledButton, {
    display: 'grid',
    alignItems: 'center',
    width: '100%',
    gridTemplateColumns: 'auto 1fr auto',
    columnGap: '$1b',
    padding: '$1b',
    borderRadius: '$2',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 250ms ease',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.25)'
    }
})

const StyledRound = styled('div', {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 250ms ease',
})

const StyledIcon = styled(StyledRound, {
    border: '2px solid transparent',

    variants: {
        style: {
            interactive: {
                [`${StyledClickable}:hover &`]: {
                    borderColor: '$darkPurple',
                },
                '&:hover': {
                    borderColor: '$purple',
                    color: '$white',
                },
            }
        }
    }
})

const StyledTrash = styled(StyledIcon, {
    opacity: 0,
    [`${StyledClickable}:hover &`]: {
        opacity: 1,
    },
    [`&:hover`]: {
        opacity: 1,
    },
    variants: {
        style: {
            interactive: {
                [`${StyledClickable}:hover &`]: {
                    borderColor: '$darkPurple',
                },
                [`&:hover`]: {
                    borderColor: '$purple',
                    backgroundColor: '$purple',
                    color: '$white',
                },
            }
        }
    }
})

const SceneItem: React.FC<{
    id: string,
    iconProps?: any,
    icon?: any,
    draggable?: boolean,
    isGroup?: boolean,
    onClick?: () => void,
}> = ({children,
                           iconProps = {},
                           icon,
                           id,
                           isGroup,
                            draggable = true,
                           onClick: passedOnClick}) => {

    const {onClick} = useMemo(() => ({
        onClick: () => {
            if (passedOnClick) {
                passedOnClick()
            }
        }
    }), [passedOnClick])

    return (
        <>
            <StyledDraggableContainer>
                <StyledClickable onClick={onClick}>
                    <StyledIcon {...iconProps} style={draggable ? 'interactive' : ''}>
                        {icon}
                    </StyledIcon>
                    <div>
                        {children}
                    </div>
                    <StyledTrash style="interactive">
                        <FaTrash size={10}/>
                    </StyledTrash>
                </StyledClickable>
            </StyledDraggableContainer>
            {
                !isGroup && (
                    <SceneChildren id={id}/>
                )
            }
        </>
    )
}

const Draggable: React.FC<RenderItemParams> = ({item, onExpand, onCollapse, provided, snapshot}) => {

    const isGroup = item.data.type === TreeItemType.group
    const cantDrag = item.children.length > 0 && item.isExpanded
    const {isExpanded = false} = item

    const {
        onBlur,
        onDragStart,
        onFocus,
        onKeyDown,
        onMouseDown,
        onTouchStart,
        ...otherProps,
    } = provided.dragHandleProps

    const dragHandleProps = cantDrag ? {
        ...otherProps,
    } : {
        onBlur,
        onDragStart,
        onFocus,
        onKeyDown,
        onMouseDown,
        onTouchStart,
        ...otherProps,
    }

    const onHandleClicked = () => {
        if (isExpanded) {
            onCollapse(item.id)
        } else {
            onExpand(item.id)
        }
    }

    const iconType = isGroup ? isExpanded ? SceneItemIcon.group : SceneItemIcon.groupClosed : SceneItemIcon.component

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}>
            <SceneItem
                id={item.id}
                iconProps={dragHandleProps}
                onClick={isGroup ? onHandleClicked : undefined}
                icon={<ItemIcon iconType={iconType}/>} isGroup={isGroup} draggable={!cantDrag}>
                {item.data ? item.data.title : ''}
            </SceneItem>
        </div>
    );
}

const StyledContainer = styled('div', {
    overflowY: 'auto',
    padding: `6px 0`,
})

export const SceneList: React.FC = () => {

    const [tree, setState] = useSceneTree()

    const {
        onExpand,
        onCollapse,
        onDragEnd,
    } = useMemo(() => ({
        onExpand: (itemId: ItemId) => {
            setState(mutateTree(tree, itemId, {isExpanded: true}));
        },
        onCollapse: (itemId: ItemId) => {
            setState(mutateTree(tree, itemId, {isExpanded: false}));
        },
        onDragEnd: (
            source: TreeSourcePosition,
            destination?: TreeDestinationPosition,
        ) => {
            if (!destination) {
                return;
            }
            const destinationItem = tree.items[destination.parentId]
            if (destination.parentId !== 'root' && (!destinationItem || destinationItem.data.type !== TreeItemType.group)) return
            const updatedTree = moveItemOnTree(tree, source, destination)
            // todo - reference updated tree and update the new order
            setState(updatedTree);
        },
    }), [tree])


    return (
        <StyledContainer>
            <Tree
                tree={tree}
                renderItem={Draggable}
                onExpand={onExpand}
                onCollapse={onCollapse}
                onDragEnd={onDragEnd}
                isDragEnabled
                isNestingEnabled
                offsetPerLevel={sidePadding}
            />
        </StyledContainer>
    );
}