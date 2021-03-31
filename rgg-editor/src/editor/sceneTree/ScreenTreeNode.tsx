import React, {memo, MutableRefObject, useMemo} from "react"
import {styled} from "../ui/stitches.config";
import {NodeRendererProps} from "react-sortable-tree";
import {FaCube, FaEye, FaEyeSlash, FaFolder, FaFolderOpen} from "react-icons/fa";
import {StyledHeading} from "../ui/typography";
import {useComponentName, useGroup, useIsComponentVisible, useIsItemSelected} from "../state/immer/hooks";
import {useComponent} from "../state/components/hooks";
import {deselectComponents, setComponentVisibility, setSelectedComponents} from "../state/immer/actions";
import {displayComponentContextMenu, setComponentHovered, useIsComponentHovered} from "../state/ui";
import {isCommandPressed, isShiftPressed} from "../state/inputs";
import {useSelectComponentsInRangeRef} from "./SceneTreeView.context";
import {setLastSelected} from "./SceneTreeView.state";
import {StyledRoundButton} from "../ui/buttons";
import {getStoreState} from "../state/immer/immer";

const StyledWrapper = styled('div', {
    paddingRight: '$2',
})

export const StyledComponentContainer = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    height: '32px',
    columnGap: '$1b',
    padding: '$1',
    cursor: 'pointer',
    borderRadius: '$1',
    variants: {
        theme: {
            default: {
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                },
            },
            active: {
                backgroundColor: 'rgba(0,0,0,0.5)',
            },
            selected: {
                backgroundColor: '$purple',
                color: '$white',
            },
        },
    },
})

export const StyledIconWrapper = styled('div', {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

const StyledGrabHandle = styled(StyledIconWrapper, {
})

export const StyledNameWrapper = styled('div', {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    '> *:not(:first-child)': {
        marginLeft: '$1b',
    }
})

export const StyledName = styled(StyledHeading, {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    userSelect: 'none',
})

const StyledButton = styled(StyledRoundButton, {
    opacity: 0,
    borderColor: 'transparent',
    [`${StyledComponentContainer}:hover &`]: {
        opacity: 1,
        borderColor: '$purple',
    },
    variants: {
        theme: {
            active: {
                opacity: 1,
            },
        },
    }
})

const useGroupData = (id: string) => {
    const group = useGroup(id)
    return group?.name ?? ''
}

const useComponentData = (id: string) => {
    const storedName = useComponentName(id)
    const component = useComponent(id)
    return storedName || (component?.name ?? '')
}

const useName = (id: string, isGroup: boolean) => {

    const componentName = useComponentData(id)
    const groupName = useGroupData(id)

    return isGroup ? groupName : componentName

}

const Component: React.FC<{
    id: string,
    treeIndex: number,
    isGroup: boolean,
    canDrag: boolean,
    expanded: boolean,
    hasChildren: boolean,
    isLandingPadActive: boolean,
    connectDragSource: NodeRendererProps['connectDragSource'],
    onIconClickRef: MutableRefObject<() => void>,
}> = ({
          id,
          treeIndex,
          isGroup,
          canDrag,
          expanded,
          hasChildren,
          isLandingPadActive,
          connectDragSource,
          onIconClickRef
      }) => {

    const name = useName(id, isGroup)
    const isHovered = useIsComponentHovered(id)
    const isSelected = useIsItemSelected(id)
    const isVisible = useIsComponentVisible(id)
    const selectComponentsInRangeRef = useSelectComponentsInRangeRef()

    const icon = useMemo(() => {
        if (isGroup) {
            if (expanded) {
                return <FaFolderOpen size={10}/>
            }
            return <FaFolder size={10}/>
        }
        return <FaCube size={10}/>
    }, [hasChildren, expanded, isGroup])

    const {
        onClick,
        onPointerEnter,
        onPointerLeave,
    } = useMemo(() => ({
        onClick: (event: any) => {
            event.stopPropagation()

            if (isShiftPressed()) {
                selectComponentsInRangeRef.current(id, treeIndex)
            } else if (isCommandPressed()) {
                if (isSelected) {
                    deselectComponents([id])
                } else {
                    setSelectedComponents([id], false)
                    setLastSelected(id)
                }
            } else {
                setSelectedComponents([id])
                setLastSelected(id)
            }

        },
        onPointerEnter: () => {
            setComponentHovered(id)
        },
        onPointerLeave: () => {
            setComponentHovered(id, false)
        }
    }), [treeIndex, isSelected, selectComponentsInRangeRef])

    const {
        toggleVisibility
    } = useMemo(() => ({
        toggleVisibility: (event: any) =>{
            event.stopPropagation()
            setComponentVisibility(id, !isVisible)
        }
    }), [isVisible])

    const {
        onContextMenu,
    } = useMemo(() => ({
        onContextMenu: (event: any) => {
            event.preventDefault()
            displayComponentContextMenu(Object.keys(getStoreState().selectedComponents), [event.clientX, event.clientY])
        }
    }), [])

    const handle = useMemo(() => {
        const content = (
            <StyledGrabHandle onClick={(event: any) => {
                onIconClickRef.current()
                event.stopPropagation()
            }}>
                {icon}
            </StyledGrabHandle>
        )
        return canDrag ? connectDragSource(
            <div className="dragHandle">
                {content}
            </div>, {
                dropEffect: 'copy',
            }) : content;
    }, [onIconClickRef, icon, canDrag])


    return (
        <StyledWrapper>
            <StyledComponentContainer onClick={onClick}
                                      onContextMenu={onContextMenu}
                                      onPointerEnter={onPointerEnter}
                                      onPointerLeave={onPointerLeave}
                                      theme={
                                 isSelected ? 'selected' : (isLandingPadActive || isHovered) ? 'active' : 'default'
                             }>
                {handle}
                <StyledNameWrapper>
                    <StyledName>
                        {name}
                    </StyledName>
                </StyledNameWrapper>
                <div>
                    <StyledButton onClick={toggleVisibility} theme={!isVisible ? 'active' : undefined}>
                        {
                            isVisible ? <FaEye size={11}/> : <FaEyeSlash size={11}/>
                        }
                    </StyledButton>
                </div>
            </StyledComponentContainer>
        </StyledWrapper>
    )
}

export const ScreenTreeNode = memo(Component)
