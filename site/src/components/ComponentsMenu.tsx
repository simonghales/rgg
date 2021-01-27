import React, {useContext} from "react"
import styled, {css} from "styled-components";
import {Children, useEditContext} from "./EditProvider";
import {isEqual} from "lodash-es";
import {cssButtonReset, StyledSmallButton} from "../ui/buttons";
import {useRegisteredComponents} from "../state/editor";
import {addTempComponent, resetTempComponentsStore} from "../state/tempComponents";
import {resetComponentsStore, useComponentsStore, useInitialComponentsStore} from "../state/components";
import {COLORS} from "../ui/colors";

const StyledContainer = styled.div`
  width: 220px;
  background-color: #161617;
  color: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const StyledHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  position: relative;

  h3 {
    font-weight: 700;
    font-size: 13px;
    color: #9494b7;
  }
  
`

const StyledButtonWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0;
`

const StyledComponentsList = styled.ul`
  flex: 1;
  overflow-y: auto;
  margin-left: -8px;
  margin-right: -8px;
  padding-bottom: 16px;

    > li {
        margin-top: 4px;
    }

`

const StyledComponent = styled.div`
  
  ul {
    padding-left: 10px;
    
    > li {
      margin-top: 2px;
    }
    
  }

`

const cssNotSelected = css`

  &:focus,
  &:hover {
    background-color: rgba(0,0,0,0.25);
  }
  
`

const cssSelected = css`
  background-color: ${COLORS.purple};
  color: white;
`

const cssChild = css`
  font-size: 13px;
  padding: 10px 12px;
`

const StyledButton = styled.button<{
    selected: boolean,
    child: boolean,
}>`
  ${cssButtonReset};
  
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 250ms ease;
  color: ${COLORS.lightPurple};
  font-weight: 700;
  
  font-size: 14.5px;
  
  ${props => props.child ? cssChild : ''};

  &:focus {
    outline: none;
  }
  
  ${props => props.selected ? cssSelected : cssNotSelected};
  
`

const StyledFooter = styled.footer`
  margin-top: 16px;
`

const useIsSelected = (uid: string, parentPath: string[] = []) => {
    const {selectedComponents} = useEditContext()
    if (uid !== selectedComponents.uid) return false
    if (selectedComponents.parentPath) {
        return isEqual(parentPath, selectedComponents.parentPath)
    }
    return true
}

const Component: React.FC<{
    name: string,
    uid: string,
    id: string,
    components?: Children,
    parentPath?: string[],
    child?: boolean,
}> = ({name, uid, id, components, parentPath = [], child = false}) => {

    const {selectComponent} = useEditContext()
    const parentBasedUid = `${uid}:${parentPath.join(':')}`
    const selected = useIsSelected(parentBasedUid, parentPath)

    return (
        <StyledComponent>
            <StyledButton onClick={() => selectComponent(parentBasedUid, id, parentPath)} selected={selected} child={child}>
                {name}
            </StyledButton>
            {
                components && (
                    <ul>
                        {
                            Object.entries(components).map(([childUid, {id, name, children}]) => (
                                <li key={childUid}>
                                    <Component name={name} id={id} uid={childUid} components={children} parentPath={parentPath?.concat([uid])} child/>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </StyledComponent>
    )
}

const ComponentsMenu: React.FC<{
    components: Children
}> = ({components}) => {
    const registeredComponents = useRegisteredComponents()

    const addComponent = () => {
        const components = Object.keys(registeredComponents)
        if (components.length === 0) return
        addTempComponent(components[0])
    }

    const discardChanges = () => {
        resetComponentsStore()
        resetTempComponentsStore()
    }

    return (
        <StyledContainer>
            <StyledHeader>
                <h3>Scene</h3>
                <StyledButtonWrapper>
                    <StyledSmallButton onClick={addComponent}>
                        Add component
                    </StyledSmallButton>
                </StyledButtonWrapper>
            </StyledHeader>
            <StyledComponentsList>
                {
                    Object.entries(components).map(([uid, {id, name, children}]) => (
                        <li key={uid}>
                            <Component uid={uid} id={id} name={name} components={children}/>
                        </li>
                    ))
                }
            </StyledComponentsList>
            <StyledFooter>
                <StyledSmallButton onClick={discardChanges}>
                    Discard changes
                </StyledSmallButton>
            </StyledFooter>
        </StyledContainer>
    )
}

export default ComponentsMenu