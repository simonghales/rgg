import React, {useCallback} from "react"
import styled from "styled-components";
import ComponentPreview from "./ComponentPreview";
import {getCreatable, useCreatables} from "../../../state/creatables";
import {setAddingComponent} from "../../../state/editor";
import {addNewUnsavedComponent, setSelectedComponent} from "../../../state/components/componentsState";

const StyledContainer = styled.ul`
  height: 100%;
  overflow-y: auto;
  padding: 8px;
  
  > li {
  
    &:not(:first-child) {
        margin-top: 4px;
    }
    
  }
  
`

const AddComponentList: React.FC<{
    filter: string,
}> = () => {
    const components = useCreatables()

    const onSelect = useCallback((uid: string) => {
        const component = getCreatable(uid)
        if (component) {
            const addedComponent = addNewUnsavedComponent(component)
            setSelectedComponent(true, addedComponent.uid)
        }
        setAddingComponent(false)
    }, [])

    return (
        <StyledContainer>
            {
                components.map(({uid, name}) => (
                    <li key={uid}>
                        <ComponentPreview name={name} uid={uid} onSelect={() => onSelect(uid)}/>
                    </li>
                ))
            }
        </StyledContainer>
    )
}

export default AddComponentList