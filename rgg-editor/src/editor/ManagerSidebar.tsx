import React from "react"
import {SceneList, StyledButton} from "./SceneList";
import { styled } from "./ui/sitches.config";

const StyledContainer = styled('div', {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'auto 1fr auto',
})

export const StyledPlainButton = styled(StyledButton, {
    fontSize: '$1b',
    fontWeight: '$medium',
    border: '2px solid $purple',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '9999999px',
    padding: '$2',
    transition: '200ms ease all',
    '&:not(:disabled)': {
        cursor: 'pointer',
    },
    '&:hover:not(:disabled)': {
        borderColor: '$purple',
        backgroundColor: '$purple',
        color: '$white',
    },
    '&:disabled': {
      borderColor: 'transparent',
        opacity: 0.6,
    },
    variants: {
        appearance: {
          faint: {
              borderColor: '$darkPurple',
          }
        },
        shape: {
            full: {
                width: '100%',
            },
            thinner: {
                padding: '0 $2b',
                height: '25px',
            },
            round: {
                padding: '0',
                width: '25px',
                height: '25px',
            }
        }
    }
})

export const StyledHeading = styled('h3', {
    fontSize: '$1b'
})

const StyledBox = styled('div', {})

export const StyledPaddedBox = styled('div', {
    padding: '$2b $3',
    variants: {
        visual: {
            top: {
                borderBottom: '1px solid $faint',
            },
            bottom: {
                borderTop: '1px solid $faint',
            },
        }
    }
})

export const ManagerSidebar: React.FC = () => {

    return (
        <StyledContainer>
            <StyledPaddedBox visual="top">
                <StyledHeading>
                    Scene
                </StyledHeading>
            </StyledPaddedBox>
            <StyledBox>
                <SceneList/>
            </StyledBox>
            <StyledPaddedBox visual="bottom">
                <StyledPlainButton shape="full">
                    Add Component
                </StyledPlainButton>
            </StyledPaddedBox>
        </StyledContainer>
    )
}