import {styled} from "./ui/sitches.config";
import React from "react";
import {setEditMode, useIsEditMode} from "./state/editor";
import {StyledPlainButton} from "./ManagerSidebar";
import {getMainStateStoreState} from "./state/main/store";
import {useComponentsStore} from "./state/components/store";
import {redoState, undoState} from "./state/history/actions";
import {FaRedo, FaUndo} from "react-icons/fa";

const StyledHeader = styled('header', {
    backgroundColor: '$darkGrey',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    height: '$headerHeight',
    padding: '0 $2'
})

const StyledHeaderSide = styled('div', {
    width: '300px',
    'h3': {
        fontSize: '$2',
        letterSpacing: '1px',
    }
})

const StyledHeaderMiddle = styled('div', {
    display: 'flex',
    justifyContent: 'center',
})

const StyledHeaderOptions = styled(StyledHeaderSide, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '> *:not(:last-child)': {
        marginRight: '$1',
    }
})

export const Header: React.FC = () => {
    const isEditMode = useIsEditMode()
    return (
        <StyledHeader>
            <StyledHeaderSide>
                <h3>RGG</h3>
            </StyledHeaderSide>
            <StyledHeaderMiddle>
                <StyledPlainButton shape="thinner" onClick={() => {
                    setEditMode(!isEditMode)
                }}>
                    {
                        isEditMode ? "Play" : "Edit"
                    }
                </StyledPlainButton>
            </StyledHeaderMiddle>
            <StyledHeaderOptions>
                <StyledPlainButton shape="thinner" appearance="faint" onClick={() => {
                    console.log(getMainStateStoreState())
                    console.log(useComponentsStore.getState())
                }}>
                    Debug
                </StyledPlainButton>
                <StyledPlainButton shape="thinner" appearance="faint">
                    Discard
                </StyledPlainButton>
                <StyledPlainButton shape="round" appearance="faint" onClick={undoState}>
                    <FaUndo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton shape="round" appearance="faint" disabled onClick={redoState}>
                    <FaRedo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton shape="thinner">
                    Save
                </StyledPlainButton>
            </StyledHeaderOptions>
        </StyledHeader>
    )
}