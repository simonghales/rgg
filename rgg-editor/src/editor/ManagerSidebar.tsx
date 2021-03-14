import React, {useState} from "react"
import {SceneList, StyledButton} from "./SceneList";
import { styled } from "./ui/sitches.config";
import {setSelectedComponents} from "./state/main/actions";
import {addingComponentClosed, setDisplayAddingComponent, uiProxy} from "./state/ui";

const StyledContainer = styled('div', {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
})

export const StyledTextButton = styled(StyledButton, {
    cursor: 'pointer',
    color: '$midPurple',
    '&:hover': {
        color: '$lightPurple',
        textDecoration: 'underline',
    }
})

export const StyledPlainButton: any = styled(StyledButton, {
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
            tiny: {
              padding: '0 $1b',
              fontSize: '$1',
            },
            full: {
                width: '100%',
            },
            thinner: {
                padding: '0 $2b',
                height: '25px',
            },
            thinnerWide: {
                padding: '0 $2b',
                height: '25px',
                width: '100%',
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

const StyledBox = styled('div', {
    maxHeight: '100%',
})

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

const StyledHeader = styled(StyledPaddedBox, {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto',
    columnGap: '$2',
})

export enum VIEWS {
    active = 'active',
    deactivated = 'deactivated',
}

export const ManagerSidebar: React.FC = () => {

    const [selectedView, setSelectedView] = useState(VIEWS.active)

    return (
        <StyledContainer>
            <StyledHeader visual="top">
                <StyledHeading>
                    Scene
                </StyledHeading>
                <div>
                    <select value={selectedView} onChange={event => setSelectedView(event.target.value as VIEWS)}>
                        <option value={VIEWS.active}>Active</option>
                        <option value={VIEWS.deactivated}>Deactivated</option>
                    </select>
                </div>
            </StyledHeader>
            <StyledBox onClick={() => {
                if (!uiProxy.displayAddingComponent && addingComponentClosed < Date.now() - 50) {
                    setSelectedComponents({})
                }
            }}>
                <SceneList view={selectedView}/>
            </StyledBox>
            <StyledPaddedBox visual="bottom">
                <StyledPlainButton shape="full" onClick={() => {
                    setDisplayAddingComponent(true)
                }}>
                    Add Component
                </StyledPlainButton>
            </StyledPaddedBox>
        </StyledContainer>
    )
}