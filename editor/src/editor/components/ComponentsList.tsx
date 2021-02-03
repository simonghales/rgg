import React from "react"
import styled from "styled-components";
import {SPACE_UNITS} from "../../ui/units";
import {ListOfComponents} from "./Component";
import {useComponentsRootList} from "../../state/components";
import DeactivatedComponents from "./DeactivatedComponents";
import {useHasDeactivatedComponents} from "../../state/deactivated";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledMain = styled.div`
  flex: 1;
`

const StyledComponentsContainer = styled.div`
  padding: ${SPACE_UNITS.medium}px 12px;
  height: 100%;
  overflow-y: auto;
`

const StyledDeactivatedContainer = styled.div``

const ComponentsList: React.FC = () => {

    const components = useComponentsRootList()
    const hasDeactivated = useHasDeactivatedComponents()

    return (
        <StyledContainer>
            <StyledMain>
                <StyledComponentsContainer>
                    <ListOfComponents components={components}/>
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