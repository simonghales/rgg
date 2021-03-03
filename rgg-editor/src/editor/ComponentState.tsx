import React from "react"
import { styled } from "./ui/sitches.config"

const StyledContainer = styled('div', {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr auto',
})

export const ComponentState: React.FC = () => {
    return (
        <StyledContainer>
            <div>
                TOP STATE
            </div>
            <div>
                BOTTOM STATE
            </div>
        </StyledContainer>
    )
}