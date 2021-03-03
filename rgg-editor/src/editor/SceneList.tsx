// @ts-nocheck
import React, {useEffect, useMemo, useState} from "react"
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
import {FaFolder, FaFolderOpen, FaCube, FaTrash, FaCaretDown, FaCaretUp} from "react-icons/fa";
import {setComponentsTree, setSelectedComponents} from "./state/main/actions";
import {useSelectedComponents} from "./state/main/hooks";
import {useComponentsStore} from "./state/components/store";
import {ComponentState} from "./state/components/types";
import {getMainStateStoreState, useMainStateStore} from "./state/main/store";
import {sortBy} from "lodash-es";
import {useComponent} from "./state/components/hooks";

export const useIsItemSelected = (id: string) => {
    const selectedComponents = Object.keys(useSelectedComponents())
    return selectedComponents.includes(id)
}

enum TreeItemType {
    group = 'group',
    component = 'component',
}

enum SceneItemIcon {
    group = 'group',
    groupClosed = 'groupClosed',
    component = 'component'
}

const ROOT_ID = '__root'

const generateTree = (components: {
    [key: string]: ComponentState,
}): TreeData => {
    const items = {}
    const rootChildren: string[] = []
    Object.entries(components).forEach(([id, component]) => {
        items[id] = {
            id,
            children: component.children,
            data: {
                title: component.name,
                type: TreeItemType.component,
            }
        }
        if (component.isRoot) {
            rootChildren.push(id)
        }
    })
    items[ROOT_ID] = {
        id: ROOT_ID,
        children: rootChildren,
    }
    const componentsTree = getMainStateStoreState().componentsTree
    Object.values(items).forEach((item) => {
        if (componentsTree[item.id]) {
            const last = item.children.length;
            const sortedChildren = sortBy(item.children, (child) => {
                return componentsTree[item.id].children.indexOf(child) !== -1 ? componentsTree[item.id].children.indexOf(child) : last;
            })
            item.children = sortedChildren
        }
    })
    return {
        rootId: ROOT_ID,
        items: items,
    }
}

const useSceneTree = (): TreeData => {

    const components = useComponentsStore(state => state.components)

    const [tree, setTree] = useState<TreeData>(() => generateTree(components))

    useEffect(() => {
        setTree(generateTree(components))
    }, [components])

    return [tree, setTree]
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

const useItemData = (id: string) => {
    const component = useComponent(id)
    return component
}

const SceneChild: React.FC<{
    id: string,
}> = ({id}) => {
    const data = useItemData(id)
    return (
        <SceneItem id={id} icon={<ItemIcon iconType={SceneItemIcon.component}/>} draggable={false} itemChildren={Object.keys(data.children)}>
            {data.name}
        </SceneItem>
    )
}

const SceneChildren: React.FC<{
    id: string,
    itemChildren: string[],
}> = ({id, itemChildren}) => {
    return (
        <StyledChildrenContainer>
            {
                itemChildren.map((childId) => (
                    <SceneChild id={childId} key={childId}/>
                ))
            }
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
    },
    variants: {
        appearance: {
            selected: {
                color: '$white',
                backgroundColor: '$purple',
                '&:hover': {
                    backgroundColor: '$purple',
                }
            }
        }
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

const StyledToggleIcon = styled('span', {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px',
    marginLeft: '2px',
    '&:hover': {
        color: '$white',
    }
})

const selectItem = (id: string) => {
    setSelectedComponents({
        [id]: true,
    })
}

const SceneItem: React.FC<{
    id: string,
    itemChildren: string[],
    iconProps?: any,
    icon?: any,
    draggable?: boolean,
    isGroup?: boolean,
    isExpanded?: boolean,
    onClick?: () => void,
}> = ({children,
                           iconProps = {},
                           icon,
                           id,
                           isGroup,
                            draggable = true,
                           isExpanded = false,
                           itemChildren,
                           onClick: passedOnClick}) => {

    const isSelected = useIsItemSelected(id)

    const {onClick} = useMemo(() => ({
        onClick: () => {
            selectItem(id)
        }
    }), [])

    return (
        <>
            <StyledDraggableContainer>
                <StyledClickable onClick={onClick} appearance={isSelected ? 'selected' : ''}>
                    <StyledIcon {...iconProps} style={draggable ? 'interactive' : ''}>
                        {icon}
                    </StyledIcon>
                    <div>
                        {children}
                        {
                            isGroup && (
                                <StyledToggleIcon onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    passedOnClick()
                                }}>
                                    {
                                        isExpanded ? (
                                            <FaCaretUp size={11}/>
                                        ) : (
                                            <FaCaretDown size={11}/>
                                        )
                                    }
                                </StyledToggleIcon>
                            )
                        }
                    </div>
                    <StyledTrash style="interactive">
                        <FaTrash size={10}/>
                    </StyledTrash>
                </StyledClickable>
            </StyledDraggableContainer>
            {
                !isGroup && (
                    <SceneChildren id={id} itemChildren={itemChildren}/>
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
                itemChildren={item.children}
                iconProps={dragHandleProps}
                onClick={isGroup ? onHandleClicked : undefined}
                icon={<ItemIcon iconType={iconType}/>} isGroup={isGroup} draggable={!cantDrag}
                isExpanded={isExpanded}>
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
            if (destination.parentId !== ROOT_ID && (!destinationItem || destinationItem.data.type !== TreeItemType.group)) return
            const updatedTree = moveItemOnTree(tree, source, destination)
            setComponentsTree(updatedTree)
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