import React from "react"
import styled from "styled-components";
import root from 'react-shadow/styled-components';
import {StyledIconWrapper, StyledPlainButton } from "../ui/buttons";
import {FaRedo, FaUndo} from "react-icons/fa";
import { GlobalStyle } from "../ui/global";
import {setEditMode, useIsEditMode} from "../state/editor";
import {discardChanges, saveChanges} from "../state/main/actions";
import {useCanRedo, useCanUndo} from "../state/history/hooks";
import {redoState, undoState} from "../state/history/actions";

const StyledWrapper = styled.div`
    height: 100%;

    > div {
      height: 100%;
    }

`

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
`

const StyledSide = styled.div`
  flex: 1 1 1px;
  height: 100%;
`

const StyledLeftSide = styled(StyledSide)`
  display: flex;
  align-items: center;
  padding-left: 8px;
`

const StyledRightSide = styled(StyledSide)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
`

const StyledOptions = styled.ul`
  display: flex;
  
  li {
    
      &:not(:first-child) {
        margin-left: 4px;
      }
    
  }
  
`

const StyledMiddle = styled.div`
  width: 100%;
  max-width: 100px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TopBar: React.FC = () => {

    const canUndo = useCanUndo()
    const canRedo = useCanRedo()
    const isEditMode = useIsEditMode()

    return (
        <StyledWrapper>
            <root.div>
                <GlobalStyle/>
                <StyledContainer>
                    <StyledLeftSide>
                        <span>RGG</span>
                    </StyledLeftSide>
                    <StyledMiddle>
                        <StyledPlainButton onClick={() => {
                            setEditMode(!isEditMode)
                        }}>
                            {
                                isEditMode ? "Play" : "Edit"
                            }
                        </StyledPlainButton>
                    </StyledMiddle>
                    <StyledRightSide>
                        <StyledOptions>
                            <li>
                                <StyledPlainButton faint onClick={() => {
                                    discardChanges()
                                }}>Discard</StyledPlainButton>
                            </li>
                            <li>
                                <StyledPlainButton round faint disabled={!canUndo} onClick={undoState}>
                                    <StyledIconWrapper>
                                        <FaUndo size={10}/>
                                    </StyledIconWrapper>
                                </StyledPlainButton>
                            </li>
                            <li>
                                <StyledPlainButton round faint disabled={!canRedo} onClick={redoState}>
                                    <StyledIconWrapper>
                                        <FaRedo size={10}/>
                                    </StyledIconWrapper>
                                </StyledPlainButton>
                            </li>
                            <li>
                                <StyledPlainButton onClick={() => {
                                    saveChanges()
                                }}>Save</StyledPlainButton>
                            </li>
                        </StyledOptions>
                    </StyledRightSide>
                </StyledContainer>
            </root.div>
        </StyledWrapper>
    )
}

export default TopBar