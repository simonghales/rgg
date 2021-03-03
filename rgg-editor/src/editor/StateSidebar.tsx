import React from "react"
import { styled } from "./ui/sitches.config"
import {StyledHeading, StyledPaddedBox, StyledPlainButton} from "./ManagerSidebar";
import {ComponentState} from "./ComponentState";

const StyledContainer = styled('div', {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
})

export const StateSidebar: React.FC = () => {
    return (
        <StyledContainer>
            <StyledPaddedBox visual="top">
                <StyledHeading>
                    Component
                </StyledHeading>
            </StyledPaddedBox>
            <div>
                <ComponentState/>
            </div>
            <StyledPaddedBox visual="bottom">
                <StyledPlainButton shape="full">
                    Add Module
                </StyledPlainButton>
            </StyledPaddedBox>
        </StyledContainer>
    )
}