import React, {useCallback, useMemo} from "react"
import styled, {css} from "styled-components";
import {cssResetButton, StyledIconWrapper, StyledPlainButton} from "../../ui/buttons";
import {COLORS} from "../../ui/colors";
import {useComponent, useComponents} from "../../state/components";
import {
    addDeactivatedComponent,
    removeUnsavedComponent,
    setSelectedComponent,
    useIsSelectedComponent
} from "../../state/componentsState";
import {FaTrash} from "react-icons/fa";
import {ComponentState} from "../../state/types";
import {setComponentSidebarHovered, useIsHovered} from "../../state/localState";

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
                components.map(({uid}) => (
                    <li key={uid}>
                        <Component uid={uid}/>
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

export const StyledClickable = styled.button<{
    selected: boolean,
    hovered?: boolean,
}>`
  ${cssResetButton};
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 250ms ease;
  color: ${COLORS.lightPurple};
  font-weight: 700;
  font-size: 0.8rem;
  
  ${StyledChildComponentsWrapper} & {
    font-size: 0.75rem;
  }
  
  &:focus {
    outline: none;
  }
  
  ${props => props.hovered ? cssHovered : ''};
  ${props => props.selected ? cssSelected : cssNotSelected};
  
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
}> = ({uid}) => {

    const component = useComponent(uid)
    const children = useComponents(component.children)
    const isSelected = useIsSelectedComponent(uid)
    const isHovered = useIsHovered(uid)

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
        setSelectedComponent(uid)
    }, [])

    const onDelete = useCallback(() => {
        if (component.unsaved) {
            removeUnsavedComponent(uid)
        } else {
            addDeactivatedComponent(uid)
        }
    }, [])

    return (
        <StyledContainer>
            <StyledClickableWrapper>
                <StyledClickable onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} selected={isSelected} hovered={isHovered}>
                    <span>{component.name}</span>
                </StyledClickable>
                {
                    component.isRoot && (
                        <StyledDeleteWrapper>
                            <StyledDeleteButton round faint onClick={onDelete}>
                                <StyledIconWrapper>
                                    <FaTrash size={10}/>
                                </StyledIconWrapper>
                            </StyledDeleteButton>
                        </StyledDeleteWrapper>
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