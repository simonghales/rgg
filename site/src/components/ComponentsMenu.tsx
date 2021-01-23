import React, {useContext} from "react"
import styled, {css} from "styled-components";
import {Children, useEditContext} from "./EditProvider";
import {isEqual} from "lodash-es";
import {cssButtonReset} from "../ui/buttons";

const StyledContainer = styled.div`
  width: 220px;
  background-color: #161617;
  color: white;
  padding: 16px;
  
  h3 {
    margin-top: 8px;
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 13px;
    color: #9494b7;
    padding-left: 8px;
  }
  
`

const StyledComponentsList = styled.ul`
  margin-left: -8px;
  margin-right: -8px;

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
  background-color: #3e3ca2;
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
  color: #9494b7;
  font-weight: 700;
  
  font-size: 14.5px;
  
  ${props => props.child ? cssChild : ''};

  &:focus {
    outline: none;
  }
  
  ${props => props.selected ? cssSelected : cssNotSelected};
  
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
    const selected = useIsSelected(uid, parentPath)

    return (
        <StyledComponent>
            <StyledButton onClick={() => selectComponent(uid, id, parentPath)} selected={selected} child={child}>
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
    return (
        <StyledContainer>
            <header>
                <h3>Scene</h3>
            </header>
            <StyledComponentsList>
                {
                    Object.entries(components).map(([uid, {id, name, children}]) => (
                        <li key={uid}>
                            <Component uid={uid} id={id} name={name} components={children}/>
                        </li>
                    ))
                }
            </StyledComponentsList>
        </StyledContainer>
    )
}

export default ComponentsMenu