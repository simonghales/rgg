import React from "react"
import {StyledClickable} from "../Component";
import styled from "styled-components";
import {StyledIconWrapper, StyledPlainButton} from "../../../ui/buttons";
import {FaMousePointer} from "react-icons/fa";
import {setAddComponentKey, setAddingComponent} from "../../../state/editor";

const StyledContainer = styled.div`
  position: relative;
`

const StyledOptions = styled.div`
  position: absolute;
  top: 0;
  right: 4px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const ComponentPreview: React.FC<{
    uid: string,
    name: string,
    onSelect: () => void,
}> = ({name, uid, onSelect}) => {
    return (
        <StyledContainer>
            <StyledClickable selected={false} onClick={onSelect}>{name}</StyledClickable>
            <StyledOptions>
                <StyledPlainButton round faint onClick={() => {
                    setAddComponentKey(uid)
                    setAddingComponent(false)
                }}>
                    <StyledIconWrapper>
                        <FaMousePointer size={10}/>
                    </StyledIconWrapper>
                </StyledPlainButton>
            </StyledOptions>
        </StyledContainer>
    )
}

export default ComponentPreview