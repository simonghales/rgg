import React from "react"
import {styled} from "./ui/stitches.config";
import {setSelectedComponents} from "./state/immer/actions";
import {addingComponentClosed, setDisplayAddingComponent, uiProxy} from "./state/ui";
import {SceneTreeView} from "./sceneTree/SceneTreeView";
import {StyledPlainButton} from "./ui/buttons";

const StyledContainer = styled('div', {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
})

export const StyledHeading = styled('h3', {
    fontSize: '$1b'
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

const StyledMain = styled('div', {
    overflowY: 'auto',
    padding: '$1b 0',
})

export enum VIEWS {
    active = 'active',
    deactivated = 'deactivated',
}

export const ManagerSidebar: React.FC = () => {

    return (
        <StyledContainer>
            <StyledHeader visual="top">
                <StyledHeading>
                    Scene
                </StyledHeading>
            </StyledHeader>
            <StyledMain onClick={() => {
                if (!uiProxy.displayAddingComponent && addingComponentClosed < Date.now() - 50) {
                    setSelectedComponents([])
                }
            }}>
                <SceneTreeView/>
            </StyledMain>
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
