import React, {useCallback} from "react"
import styled, {css} from "styled-components";
import {cssResetButton} from "../../ui/buttons";
import {COLORS} from "../../ui/colors";
import {ComponentState, useComponent, useComponents} from "../../state/components";
import {setSelectedComponent, useIsSelectedComponent} from "../../state/componentsState";

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

const cssChild = css`
  font-size: 13px;
  padding: 10px 12px;
`

const StyledChildComponentsWrapper = styled.div`
  padding-left: 8px;
  margin-top: 2px;
`

export const StyledClickable = styled.button<{
    selected: boolean,
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
  
  ${props => props.selected ? cssSelected : cssNotSelected};
  
`

const Component: React.FC<{
    uid: string,
}> = ({uid}) => {

    const component = useComponent(uid)
    const children = useComponents(component.children)
    const isSelected = useIsSelectedComponent(uid)

    const onClick = useCallback(() => {
        setSelectedComponent(uid)
    }, [])

    return (
        <StyledContainer>
            <StyledClickableWrapper>
                <StyledClickable onClick={onClick} selected={isSelected}>
                    <span>{component.name}</span>
                </StyledClickable>
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