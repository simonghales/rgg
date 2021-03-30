import React from "react"
import OutsideClickHandler from 'react-outside-click-handler';
import { styled } from "./ui/stitches.config"
import {
    // setAddingComponent,
    setDisplayAddingComponentParent,
    setDisplayAddingComponent,
    uiProxy,
    addComponent
} from "./state/ui";
import {useProxy} from "valtio";
// import {ItemIcon, SceneItemIcon, StyledClickable, StyledIcon} from "./SceneList";
import {FaCube, FaMousePointer} from "react-icons/fa";
import {useAddableStore} from "../scene/addables";
import { StyledRoundButton } from "./ui/buttons";
import {StyledComponentContainer, StyledIconWrapper, StyledName, StyledNameWrapper} from "./sceneTree/ScreenTreeNode";

const StyledContainer = styled('div', {
    position: 'absolute',
    left: '100%',
    top: 0,
    bottom: 0,
    zIndex: '$high',
    width: '260px',
    backgroundColor: '$darkGreyLighter',
    borderLeft: '1px solid $darkGrey',
    padding: '$2',
    overflowY: 'auto',
})

const StyledAddableComponent = styled(StyledComponentContainer, {
    '&:not(:first-child)': {
        marginTop: '$2',
    }
})

const StyledIcon = styled('span', {
    position: 'relative',
    left: '1px',
})

export const closeAddingComponent = () => {
    setDisplayAddingComponent(false)
    setDisplayAddingComponentParent('')
}

const AddableComponent: React.FC<{
    label: string,
    addableId: string,
}> = ({label, addableId}) => {
    return (
        <StyledAddableComponent theme={'default'} onClick={() => {
            addComponent(addableId, uiProxy.displayAddingComponentParent)
            closeAddingComponent()
        }}>
            <StyledIconWrapper>
                <FaCube size={10}/>
            </StyledIconWrapper>
            <StyledNameWrapper>
                <StyledName>
                    {label}
                </StyledName>
            </StyledNameWrapper>
            <StyledRoundButton>
                <StyledIcon>
                    <FaMousePointer size={9} />
                </StyledIcon>
            </StyledRoundButton>
        </StyledAddableComponent>
    )
}

export const AddingComponentMenu: React.FC = () => {
    const isAddingComponent = useProxy(uiProxy).displayAddingComponent
    const addables = useAddableStore(state => state.addables)
    if (!isAddingComponent) return null
    return (
        <OutsideClickHandler onOutsideClick={closeAddingComponent}>
            <StyledContainer>
                {
                    Object.entries(addables).map(([key, addable]) => (
                        <AddableComponent addableId={addable.id} label={addable.name} key={key}/>
                    ))
                }
            </StyledContainer>
        </OutsideClickHandler>
    )
}
