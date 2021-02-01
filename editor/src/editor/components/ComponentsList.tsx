import React from "react"
import styled from "styled-components";
import {SPACE_UNITS} from "../../ui/units";
import {ListOfComponents} from "./Component";
import {useComponentsRootList} from "../../state/components";

const StyledContainer = styled.div`
  padding: ${SPACE_UNITS.medium}px 12px;
  height: 100%;
  overflow-y: auto;
`

const ComponentsList: React.FC = () => {

    const components = useComponentsRootList()

    return (
        <StyledContainer>
            <ListOfComponents components={components}/>
        </StyledContainer>
    )
}

export default ComponentsList