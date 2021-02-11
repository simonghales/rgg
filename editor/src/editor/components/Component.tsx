import React, {useCallback, useEffect, useMemo, useState} from "react"
import styled, {css} from "styled-components";
import {cssResetButton, StyledIconWrapper, StyledPlainButton} from "../../ui/buttons";
import {COLORS} from "../../ui/colors";
import {useComponent, useComponents} from "../../state/components/components";
import {FaTrash} from "react-icons/fa";
import {ComponentState} from "../../state/types";
import {setComponentSidebarHovered, useIsHovered} from "../../state/localState";
import {INPUTS, isInputPressed} from "../../inputs/inputs";
import {MENU_TYPE, showContextMenu} from "../ContextMenu";
import GroupOfComponents from "./GroupOfComponents";
import {useComponentParentGroupId} from "./ComponentsContext";
import {useIsMovingComponents} from "../../state/editor";
import {useComponentName, useIsComponentSelected} from "../../state/main/hooks";
import {
    addDeactivatedComponent,
    removeUnsavedComponent,
    setSelectedComponent,
    setSelectedComponents, updateComponentName
} from "../../state/main/actions";
import {calculateNewSelectedComponents} from "../../state/main/getters";
import {SidebarItem} from "../../state/main/types";
import hotkeys from "hotkeys-js";
import ComponentEditName from "./ComponentEditName";

const StyledList = styled.ul`

    > li {
      
        &:not(:first-child) {
          margin-top: 4px;
        }
      
    }

`

export const ListOfComponents: React.FC<{
    components: ComponentState[],
}> = ({components}) => {
    return (
        <StyledList>
            {
                components.map(({uid}, index) => (
                    <li key={uid}>
                        <Component uid={uid} index={index}/>
                    </li>
                ))
            }
        </StyledList>
    )
}

export const ListOfItems: React.FC<{
    items: SidebarItem[],
}> = ({items}) => {
    return (
        <StyledList>
            {
                items.map((item, index) => (
                    <li key={item.key}>
                        {
                            (item.type === 'group') ? (
                                <GroupOfComponents uid={item.key} components={item.children || []}/>
                            ) : (
                                <Component uid={item.key} index={index}/>
                            )
                        }
                    </li>
                ))
            }
        </StyledList>
    )
}

const StyledContainer = styled.div`
  
`

const StyledClickableWrapper = styled.div`
    position: relative;
`

const cssHovered = css`
  background-color: rgba(0,0,0,0.25);
`

const cssSelected = css`
  background-color: ${COLORS.purple};
  color: white;
`

const cssNotSelected = css`

  &:focus,
  &:hover {
    ${cssHovered};
  }
  
  &:active {
    ${cssSelected};
  }
  
`

const StyledChildComponentsWrapper = styled.div`
  padding-left: 8px;
  margin-top: 2px;
`

export const cssComponentName = css`
  color: ${COLORS.lightPurple};
  font-weight: 700;
  font-size: 0.8rem;
`

const cssInactive = css`
  opacity: 0.33;
`

const cssEditing = css`
  color: transparent;
  
  span {
    visibility: hidden;
  }
  
`

export const cssClickableFont = css`
  ${cssComponentName};
  
  ${StyledChildComponentsWrapper} & {
    font-size: 0.75rem;
  }
`

export const StyledClickable = styled.button<{
    selected: boolean,
    hovered?: boolean,
    inactive?: boolean,
    editing?: boolean,
}>`
  ${cssResetButton};
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 250ms ease;
  ${cssClickableFont};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #d72859;
  }
  
  &:focus-within,
  &:focus-visible {
    box-shadow: 0 0 0 2px #d72859;
  }
  
  ${props => props.hovered ? cssHovered : ''};
  ${props => props.selected ? cssSelected : cssNotSelected};
  ${props => props.inactive ? cssInactive : ''};
  ${props => props.editing ? cssEditing : ''};
  
`

const StyledDeleteWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledDeleteButton = styled(StyledPlainButton)`
  opacity: 0;
  transition: opacity 200ms ease;
  
  ${StyledClickable}:hover + ${StyledDeleteWrapper} &,
  ${StyledClickable}:focus + ${StyledDeleteWrapper} &,
  ${StyledDeleteWrapper}:hover &,
  &:hover,
  &:focus {
    opacity: 1;
  }
  
`

const Component: React.FC<{
    uid: string,
    index: number,
}> = ({uid, index}) => {

    const parentGroupId = useComponentParentGroupId()
    const component = useComponent(uid)
    const children = useComponents(component.children)
    const isSelected = useIsComponentSelected(uid)
    const isHovered = useIsHovered(uid)
    const componentsAreBeingMoved = useIsMovingComponents()
    const [editingName, setEditingName] = useState(false) // todo - set to false
    const storedComponentName = useComponentName(uid)

    const name = storedComponentName || component.name

    useEffect(() => {
        if (!isSelected) {
            setEditingName(false)
        }
    }, [isSelected])

    const {
        onMouseEnter,
        onMouseLeave,
    } = useMemo(() => {
        return {
            onMouseEnter: () => {
                setComponentSidebarHovered(uid, true)
            },
            onMouseLeave: () => {
                setComponentSidebarHovered(uid, false)
            },
        }
    }, [])

    const onClick = useCallback(() => {

        if (isSelected) {
            if (isInputPressed(INPUTS.command)) {
                setSelectedComponent(false, uid, false)
                return
            }
        }

        if (hotkeys.shift) {
            const selectedRange = calculateNewSelectedComponents(index, uid, parentGroupId)
            setSelectedComponents(selectedRange)
        } else {
            setSelectedComponent(true, uid, !isInputPressed(INPUTS.command))
        }

    }, [parentGroupId, isSelected])

    const onRightClick = useCallback((event: MouseEvent) => {
        showContextMenu(MENU_TYPE.SIDEBAR_COMPONENT, event.pageX, event.pageY, uid)
    }, [])

    const onDelete = useCallback(() => {
        if (component.unsaved) {
            removeUnsavedComponent(uid)
        } else {
            addDeactivatedComponent(uid)
        }
    }, [])

    const onEditNameClose = useCallback(() => {
        setEditingName(false)
    }, [])

    const updateName = useCallback((updatedName: string) => {
        if (updatedName) {
            updateComponentName(uid, updatedName)
        }
    }, [])

    const onSpanClick = useCallback(() => {

        if (isSelected && !isInputPressed(INPUTS.command)) {
            setEditingName(true)
        }

    }, [isSelected])

    return (
        <StyledContainer>
            <StyledClickableWrapper>
                <StyledClickable
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    selected={isSelected}
                    hovered={isHovered}
                    inactive={componentsAreBeingMoved}
                    // @ts-ignore
                    onContextMenu={onRightClick}
                    editing={editingName}
                >
                    <span onClick={onSpanClick}>{name}</span>
                </StyledClickable>
                {
                    component.isRoot && !editingName && (
                        <StyledDeleteWrapper>
                            <StyledDeleteButton round faint onClick={onDelete}>
                                <StyledIconWrapper>
                                    <FaTrash size={10}/>
                                </StyledIconWrapper>
                            </StyledDeleteButton>
                        </StyledDeleteWrapper>
                    )
                }
                {
                    editingName && (
                        <ComponentEditName name={name} updateName={updateName} close={onEditNameClose}/>
                    )
                }
            </StyledClickableWrapper>
            {
                children.length > 0 && (
                    <StyledChildComponentsWrapper>
                        <ListOfComponents components={children}/>
                    </StyledChildComponentsWrapper>
                )
            }
        </StyledContainer>
    )
}

export default Component