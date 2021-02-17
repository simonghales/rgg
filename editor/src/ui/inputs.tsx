import React from "react";
import styled from "styled-components";
import {FaCheck} from "react-icons/fa";
import {COLORS} from "./colors";


const StyledContainer = styled.div`
  width: 1.2em;
  height: 1.2em;
  position: relative;

  input {
    opacity: 0;
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

`

const StyledVisual = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  border: 1px solid ${COLORS.faint};
  transition: all 250ms ease;

  svg {
    opacity: 0;
    transition: all 250ms ease;
  }
  
  input:hover + & {
    svg {
      opacity: 0.5;
    }
  }

  input:checked + & {
    border-color: ${COLORS.faintPurple};
    svg {
      opacity: 1;
    }
  }

`

export const InputCheckbox: React.FC = () => {
    return (
        <StyledContainer>
            <input type="checkbox"/>
            <StyledVisual>
                <FaCheck size={10}/>
            </StyledVisual>
        </StyledContainer>
    )
}