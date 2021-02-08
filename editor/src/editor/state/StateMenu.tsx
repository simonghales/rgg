import React from "react"
import root from "react-shadow/styled-components";
import {GlobalStyle} from "../../ui/global";
import styled from "styled-components";
import {useSelectedComponent} from "../../state/components/componentsState";
import {useComponent} from "../../state/components/components";
import ComponentStateMenu from "./ComponentStateMenu";

const StyledWrapper = styled.div`
`

const StateMenu: React.FC = () => {

    const selectedComponentUid = useSelectedComponent()
    const selectedComponent = useComponent(selectedComponentUid)

    return (
        <StyledWrapper>
            <root.div>
                <GlobalStyle/>
                {
                    selectedComponent && <ComponentStateMenu name={selectedComponent.name} uid={selectedComponent.uid} />
                }
            </root.div>
        </StyledWrapper>
    )
}

export default StateMenu