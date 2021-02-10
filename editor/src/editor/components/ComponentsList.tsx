import React, {useEffect} from "react"
import styled from "styled-components";
import {SPACE_UNITS} from "../../ui/units";
import DeactivatedComponents from "./DeactivatedComponents";
import {useHasDeactivatedComponents} from "../../state/deactivated";
import {ListOfItems} from "./Component";
import ComponentsContext, {COMPONENTS_PARENT_TYPE} from "./ComponentsContext";
import {getParentGroup, useSidebarItems} from "../../state/components/temp";
import {ComponentsStateStore, setGroupIsOpen, useComponentsStateStore} from "../../state/components/componentsState";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledMain = styled.div`
  flex: 1 1 1px;
  overflow: hidden;
`

const StyledComponentsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  
  > ul {
    padding: ${SPACE_UNITS.medium}px 12px;
  }
  
`

const StyledDeactivatedContainer = styled.div``

const useHandleSelectedComponentsEffects = () => {

    useEffect(() => {
        useComponentsStateStore.subscribe((selectedComponents) => {
            Object.keys(selectedComponents as ComponentsStateStore['selectedComponents']).forEach((componentId) => {
                const parentGroup = getParentGroup(componentId)
                if (parentGroup) {
                    setGroupIsOpen(parentGroup, true)
                }
            })
        }, state => state.selectedComponents)
    }, [])

}

const ComponentsList: React.FC = () => {

    const sidebarItems = useSidebarItems()

    const hasDeactivated = useHasDeactivatedComponents()

    useHandleSelectedComponentsEffects()

    return (
        <StyledContainer>
            <StyledMain>
                <StyledComponentsContainer>
                    <ComponentsContext type={COMPONENTS_PARENT_TYPE.ROOT}>
                        <ListOfItems items={sidebarItems}/>
                    </ComponentsContext>
                </StyledComponentsContainer>
            </StyledMain>
            {
                hasDeactivated && (
                    <StyledDeactivatedContainer>
                        <DeactivatedComponents/>
                    </StyledDeactivatedContainer>
                )
            }
        </StyledContainer>
    )
}

export default ComponentsList