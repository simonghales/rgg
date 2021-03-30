import {styled} from "./ui/stitches.config";
import React from "react";
import {setEditMode, useIsEditMode} from "./state/editor";
import {redoState, undoState} from "./state/history/actions";
import {FaRedo, FaUndo} from "react-icons/fa";
import {StyledPlainButton} from "./ui/buttons";
import {getStoreState} from "./state/immer/immer";
import {useHistoryStore} from "./state/history/store";
import {useCanRedo, useCanUndo} from "./state/history/hooks";

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
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()
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
                    console.log('history', useHistoryStore.getState().pastSnapshots)
                    console.log('debug', getStoreState().components['player'].modifiedState)
                }}>
                    Debug
                </StyledPlainButton>
                <StyledPlainButton shape="thinner" appearance="faint">
                    Discard
                </StyledPlainButton>
                <StyledPlainButton disabled={!canUndo} shape="round" appearance="faint" onClick={undoState}>
                    <FaUndo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton disabled={!canRedo} shape="round" appearance="faint" onClick={redoState}>
                    <FaRedo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton shape="thinner">
                    Save
                </StyledPlainButton>
            </StyledHeaderOptions>
        </StyledHeader>
    )
}
