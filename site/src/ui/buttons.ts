import styled, {css} from "styled-components";
import {COLORS} from "./colors";

export const cssButtonReset = css`
  background: none;
  border: 0;
  font: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
  cursor: pointer;
`

export const StyledSmallButton = styled.div`
  ${cssButtonReset};
  border: 2px solid ${COLORS.purple};
  color: ${COLORS.lightPurple};
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  
  &:hover {
    background-color: ${COLORS.purple};
    color: white;
  }
  
`