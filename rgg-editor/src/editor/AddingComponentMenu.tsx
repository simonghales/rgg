import React from "react"
import OutsideClickHandler from 'react-outside-click-handler';
import { styled } from "./ui/sitches.config"
import {
    setAddingComponent,
    setDisplayAddingComponentParent,
    setDisplayAddingComponent,
    uiProxy,
    addComponent
} from "./state/ui";
import {useProxy} from "valtio";
import {ItemIcon, SceneItemIcon, StyledClickable, StyledIcon} from "./SceneList";
import {FaMousePointer} from "react-icons/fa";
import {useAddableStore} from "../scene/addables";

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

const StyledAddableComponent = styled(StyledClickable, {
    '&:not(:first-child)': {
        marginTop: '$0b',
    }
})

const StyledIconWrapper = styled('span', {
    position: 'relative',
    left: '1px',
})

const closeAddingComponent = () => {
    setDisplayAddingComponent(false)
    setDisplayAddingComponentParent('')
}

const AddableComponent: React.FC<{
    label: string,
    addableId: string,
}> = ({label, addableId}) => {
    return (
        <StyledAddableComponent onClick={() => {
            addComponent(addableId, uiProxy.displayAddingComponentParent)
            closeAddingComponent()
        }}>
            <StyledIcon>
                <ItemIcon iconType={SceneItemIcon.component}/>
            </StyledIcon>
            <div>
                {label}
            </div>
            <StyledIcon appearance="clickable" onClick={(event: any) => {
                event.stopPropagation()
                setAddingComponent(addableId)
                closeAddingComponent()
            }}>
                <StyledIconWrapper>
                    <FaMousePointer size={10} />
                </StyledIconWrapper>
            </StyledIcon>
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