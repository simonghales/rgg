// @ts-nocheck
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import Tree, {
    ItemId,
    moveItemOnTree,
    mutateTree,
    RenderItemParams,
    TreeData,
    TreeDestinationPosition,
    TreeSourcePosition,
} from '@atlaskit/tree';
import {styled} from "./ui/sitches.config"
import {FaCaretDown, FaCaretUp, FaCube, FaFolder, FaFolderOpen, FaPlus} from "react-icons/fa";
import {
    deleteComponent, setComponentName,
    setComponentsTree, setComponentTreeItemExpanded, setGroupName,
    setSelectedComponents, updateComponentLocation,
    updateSelectedComponents
} from "./state/main/actions";
import {useComponentName, useSelectedComponents} from "./state/main/hooks";
import {useComponentsStore} from "./state/components/store";
import {ComponentState} from "./state/components/types";
import {getMainStateStoreState, useMainStateStore} from "./state/main/store";
import {sortBy} from "lodash-es";
import {useComponent, useComponentCanHaveChildren} from "./state/components/hooks";
import {isCommandPressed, isShiftPressed} from "./hotkeys";
import {getSelectedComponents} from "./state/main/getters";
import {TreeItem} from "@atlaskit/tree/types";
import hotkeys from "hotkeys-js";
import {displayComponentContextMenu, setDisplayAddingComponent, useIsComponentHovered} from "./state/ui";
import {VIEWS} from "./ManagerSidebar";
import {MainStateStore} from "./state/main/types";

export const useIsItemSelected = (id: string) => {
    const selectedComponents = Object.keys(useSelectedComponents())
    return selectedComponents.includes(id)
}

enum TreeItemType {
    group = 'group',
    component = 'component',
}

export enum SceneItemIcon {
    group = 'group',
    groupClosed = 'groupClosed',
    component = 'component'
}

export const ROOT_ID = '__root'

const generateTree = (components: {
    [key: string]: ComponentState,
}, groups: MainStateStore['groups'], groupedComponents: MainStateStore['groupedComponents'], showActive: boolean): TreeData => {
    const items = {}
    const rootChildren: string[] = []
    const groupsChildren: {
        [key: string]: string[]
    } = {}
    Object.entries(groups).forEach(([groupId, group]) => {
        items[groupId] = {
            id: groupId,
            children: [],
            data: {
                children: [],
                title: group.name,
                type: TreeItemType.group,
            }
        }
        if (groupedComponents[groupId]) {
            const parentGroupId = groupedComponents[groupId]
            if (groupsChildren[parentGroupId]) {
                groupsChildren[parentGroupId].push(groupId)
            } else {
                groupsChildren[parentGroupId] = [groupId]
            }
        } else {
            rootChildren.push(groupId)
        }
    })
    Object.entries(groupsChildren).forEach(([groupId, children]) => {
        if (items[groupId]) {
            items[groupId].children = items[groupId].children.concat(children)
            items[groupId].data.children = items[groupId].children
        }
    })
    Object.entries(components).forEach(([id, component]) => {
        items[id] = {
            id,
            children: [],
            data: {
                children: component.children,
                title: component.name,
                type: TreeItemType.component,
            }
        }
        if (component.isRoot) {
            if (groupedComponents[id]) {
                const groupId = groupedComponents[id]
                if (items[groupId]) {
                    items[groupId].children.push(id)
                    items[groupId].data.children = items[groupId].children
                }
            } else {
                rootChildren.push(id)
            }
        }
    })
    items[ROOT_ID] = {
        id: ROOT_ID,
        children: rootChildren,
    }
    const componentsTree = showActive ? getMainStateStoreState().componentsTree : {}
    Object.values(items).forEach((item) => {
        if (componentsTree[item.id]) {
            const treeItem = componentsTree[item.id]
            const last = item.children.length;
            const sortedChildren = sortBy(item.children, (child) => {
                return treeItem.children.indexOf(child) !== -1 ? treeItem.children.indexOf(child) : last;
            })
            item.children = sortedChildren
            item.isExpanded = treeItem.isExpanded
        }
    })
    return {
        rootId: ROOT_ID,
        items: items,
    }
}

const useSceneTree = (showActive: boolean): TreeData => {

    const activeComponents = useComponentsStore(state => state.components)
    const deactivatedComponents = useComponentsStore(state => state.deactivatedComponents)
    const groups = useMainStateStore(state => state.groups)
    const groupedComponents = useMainStateStore(state => state.groupedComponents)

    const components = showActive ? activeComponents : deactivatedComponents

    const [tree, setTree] = useState<TreeData>(() => generateTree(components, groups, groupedComponents, showActive))

    useEffect(() => {
        setTree(generateTree(components, groups, groupedComponents, showActive))
    }, [components, groups, groupedComponents])

    return [tree, setTree]
}

export const ItemIcon: React.FC<{
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
    if (!data) return null
    return (
        <SceneItem id={id} icon={<ItemIcon iconType={SceneItemIcon.component}/>} draggable={false} name={data.name}/>
    )
}

const useChildren = (id: string) => {

    const component = useComponent(id)

    return component?.children ?? []

}

const SceneChildren: React.FC<{
    id: string,
}> = ({id}) => {
    const children = useChildren(id)
    return (
        <StyledChildrenContainer>
            {
                children.map((childId) => (
                    <SceneChild id={childId} key={childId}/>
                ))
            }
        </StyledChildrenContainer>
    )
}

const StyledDraggableContainer = styled('div', {
    padding: '1px $1b',
})

const StyledWrapper = styled('div', {
    position: 'relative',
})

const StyledInputWrapper = styled('div', {
    position: 'absolute',
    top: '0',
    left: '30px',
    right: '40px',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
})

export const StyledButton = styled('button', {
    padding: 0,
    margin: 0,
    border: 0,
    font: 'inherit',
    color: 'inherit',
    backgroundColor: 'transparent',
})

export const StyledClickable = styled(StyledButton, {
    display: 'grid',
    alignItems: 'center',
    width: '100%',
    gridTemplateColumns: 'auto 1fr auto',
    columnGap: '$1b',
    padding: '$1b',
    borderRadius: '$2',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 250ms ease, border 250ms ease, color 250ms ease',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.25)'
    },
    '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 2px $pink',
    },
    variants: {
        appearance: {
            hovered: {
                backgroundColor: 'rgba(0,0,0,0.25)'
            },
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

export const StyledIcon = styled(StyledRound, {
    border: '2px solid transparent',

    variants: {
        appearance: {
            clickable: {
                '&:hover': {
                    borderColor: '$purple',
                    backgroundColor: '$purple',
                    color: '$white',
                },
            }
        },
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

const StyledOptions = styled('div', {
    display: 'flex',
    alignItems: 'center',
})

let lastSelectedItem: string = ''

const setLastSelectedItem = (id: string) => {
    lastSelectedItem = id
}

const selectItem = (id: string) => {
    setSelectedComponents({
        [id]: true,
    })
}

const addChildrenToRange = (item: TreeItem, range: string[], tree: TreeData) => {
    item.children.forEach((childId) => {
        range.push(childId)
        const childItem = tree.items[childId]
        if (childItem) {
            addChildrenToRange(childItem, range, tree)
        }
    })
    if (item.data.children) {
        item.data.children.forEach((childId) => {
            range.push(childId)
            const childItem = tree.items[childId]
            if (childItem) {
                addChildrenToRange(childItem, range, tree)
            }
        })
    }
}

const getOrderedRange = () => {
    const {components} = useComponentsStore.getState()
    const {groups, groupedComponents} = getMainStateStoreState()
    const tree = generateTree(components, groups, groupedComponents, true)
    const root = tree.items[tree.rootId]
    const range: string[] = []
    root.children.forEach((id) => {
        range.push(id)
        const item = tree.items[id]
        if (!item) return
        addChildrenToRange(item, range, tree)
    })
    return range
}

const selectRange = (id: string) => {
    const orderedRange = getOrderedRange()
    if (!lastSelectedItem) {
        const selectedComponents = Object.keys(getSelectedComponents())
        const last = selectedComponents.length;
        const sorted = sortBy(selectedComponents, (child) => {
            return orderedRange.indexOf(child) !== -1 ? orderedRange.indexOf(child) : last;
        })
        lastSelectedItem = sorted[0]
    }
    const fromIndex = orderedRange.indexOf(lastSelectedItem)
    const toIndex = orderedRange.indexOf(id)
    const reverse = toIndex < fromIndex
    const lowest = reverse ? toIndex : fromIndex
    const highest = reverse ? fromIndex : toIndex
    const selected = orderedRange.slice(lowest, highest + 1)
    const selectedComponents: {
        [key: string]: true,
    } = {}
    selected.forEach((componentId) => {
        selectedComponents[componentId] = true
    })
    setSelectedComponents(selectedComponents)
}

const EditName: React.FC<{
    name: string,
    onChange: (name: string) => void,
}> = ({name, onChange}) => {
    const [editName, setEditName] = useState(name)
    const inputRef = useRef()
    useEffect(() => {
        inputRef.current?.focus()
    }, [])
    return (
        <StyledInputWrapper as="form" onSubmit={event => {
            event.preventDefault()
            onChange(editName)
        }}>
            <input ref={inputRef} type="text" value={editName} onChange={event => setEditName(event.target.value)} onClick={event => event.stopPropagation()} onBlur={() => onChange('')}/>
        </StyledInputWrapper>
    )
}

const SceneItem: React.FC<{
    id: string,
    iconProps?: any,
    icon?: any,
    draggable?: boolean,
    isGroup?: boolean,
    isExpanded?: boolean,
    onClick?: () => void,
    name: string,
}> = ({
                           name: passedName,
          iconProps = {},
          icon,
          id,
          isGroup,
          draggable = true,
          isExpanded = false,
          onClick: passedOnClick
      }) => {

    const isSelected = useIsItemSelected(id)
    const [focused, setFocused] = useState(false)
    const buttonRef = useRef()
    const canHaveChildren = useComponentCanHaveChildren(id)
    const customName = useComponentName(id)
    const [editingName, setEditingName] = useState(false)
    const isHovered = useIsComponentHovered(id)

    const name = customName || passedName

    useEffect(() => {
        if (isSelected) {
            // buttonRef.current.focus()
        }
    }, [isSelected])

    useEffect(() => {
        if (isSelected && focused) {
            return () => {
                buttonRef.current.blur()
            }
        }
    }, [isSelected, focused])

    useEffect(() => {
        if (focused && isSelected) {

            const callback = () => {
                if (hotkeys.isPressed(27)) {
                    setSelectedComponents({})
                }
            }

            hotkeys('*', callback)

            return () => {
                hotkeys.unbind('*', callback)
            }

        }
    }, [focused, isSelected])

    const updateName = useCallback((updatedName: string) => {
        setEditingName(false)
        if (!updatedName) return
        if (isGroup) {
            setGroupName(id, updatedName)
        } else {
            setComponentName(id, updatedName)
        }
    }, [isGroup])

    const {
        onClick, onFocus,
        onBlur, onDelete,
        onAddChild,
        onContextMenu,
        onNameClicked,
    } = useMemo(() => ({
        onNameClicked: () => {
          if (isSelected) {
              setEditingName(true)
          }
        },
        onContextMenu: (event: any) => {
            event.preventDefault()
            console.log('event', event)
            displayComponentContextMenu(Object.keys(getMainStateStoreState().selectedComponents), [event.clientX, event.clientY])
        },
        onAddChild: (event: any) => {
            event.stopPropagation()
            setDisplayAddingComponent(true, id)
        },
        onDelete: (event: any) => {
            event.stopPropagation()
            deleteComponent(id)
        },
        onFocus: () => {
            setFocused(true)
        },
        onBlur: () => {
            setFocused(false)
        },
        onClick: (event: any) => {
            event.stopPropagation()
            buttonRef.current?.focus()
            if (isCommandPressed()) {
                if (isSelected) {
                    updateSelectedComponents(state => {
                        const updatedState = {
                            ...state,
                        }
                        delete updatedState[id]
                        return updatedState
                    })
                } else {
                    updateSelectedComponents(state => ({
                        ...state,
                        [id]: true,
                    }))
                }
                setLastSelectedItem(id)
            } else if (isShiftPressed()) {
                selectRange(id)
            } else {
                selectItem(id)
                setLastSelectedItem(id)
            }
        }
    }), [isSelected])

    return (
        <>
            <StyledDraggableContainer>
                <StyledWrapper>
                    <StyledClickable ref={buttonRef} onClick={onClick} onFocus={onFocus} onBlur={onBlur}
                                     onContextMenu={onContextMenu}
                                     appearance={isSelected ? 'selected' : isHovered ? 'hovered' : ''}>
                        <StyledIcon {...iconProps} style={draggable ? 'interactive' : ''}>
                            {icon}
                        </StyledIcon>
                        <div>
                            <span onClick={onNameClicked}>
                                {name}
                            </span>
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
                        <StyledOptions>
                            {
                                canHaveChildren && (
                                    <StyledTrash style="interactive" onClick={onAddChild}>
                                        <FaPlus size={10}/>
                                    </StyledTrash>
                                )
                            }
                        </StyledOptions>
                    </StyledClickable>
                    {
                        editingName && (
                            <EditName name={name} onChange={updateName}/>
                        )
                    }
                </StyledWrapper>
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
    } = provided?.dragHandleProps ?? {}

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
                itemChildren={item.data.children ?? []}
                iconProps={dragHandleProps}
                onClick={isGroup ? onHandleClicked : undefined}
                icon={<ItemIcon iconType={iconType}/>} isGroup={isGroup} draggable={!cantDrag}
                isExpanded={isExpanded} name={item.data ? item.data.title : ''}/>
        </div>
    );
}

const StyledContainer = styled('div', {
    overflowY: 'auto',
    padding: `6px 0`,
})

export const SceneList: React.FC<{
    view: VIEWS,
}> = ({view}) => {

    const showActive = view === VIEWS.active

    const [tree, setState] = useSceneTree(showActive)

    const {
        onExpand,
        onCollapse,
        onDragEnd,
    } = useMemo(() => ({
        onExpand: (itemId: ItemId) => {
            setState(mutateTree(tree, itemId, {isExpanded: true}));
            setComponentTreeItemExpanded(itemId, true)
        },
        onCollapse: (itemId: ItemId) => {
            setState(mutateTree(tree, itemId, {isExpanded: false}));
            setComponentTreeItemExpanded(itemId, false)
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
            if (source.parentId !== destination.parentId) {
                const id = tree.items[source.parentId].children[source.index]
                if (!id) {
                    throw new Error(`Id not found ${id}`)
                }
                updateComponentLocation(id, destination.parentId)
            }
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
                isDragEnabled={showActive}
                isNestingEnabled={showActive}
                offsetPerLevel={sidePadding}
                key={showActive ? 'active' : 'deactivated'}
            />
        </StyledContainer>
    );
}