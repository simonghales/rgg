import styled, {css} from "styled-components";
import {COLORS} from "./colors";

export const cssResetButton = css`
  font: inherit;
  color: inherit;
  padding: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  border: none;
`

export const StyledButton = styled.button`
  ${cssResetButton};
`

const cssRound = css`
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const cssFaint = css`
  border-color: #212052;
  color: ${COLORS.lightPurple};
  
  &:hover,
  &:focus {
    border-color: ${COLORS.purple};
  }
  
`

const cssFull = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const StyledPlainButton = styled(StyledButton)<{
    round?: boolean,
    faint?: boolean,
    full?: boolean,
    thick?: boolean,
}>`
  background: none;
  border: 2px solid ${COLORS.purple};
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: ${COLORS.lightPurple};
  font-size: 0.8rem;
  transition: all 200ms ease;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
  ${props => props.round ? cssRound : ''};
  ${props => props.faint ? cssFaint : ''};
  ${props => props.full ? cssFull : ''};
  
  &:focus {
    outline: none;
  }
  
  &:focus,
  &:hover {
    background-color: ${COLORS.purple};
    color: white;
  }
  
`

export const StyledThickerButton = styled(StyledPlainButton)`
  padding: 8px;
  font-size: 0.85rem;
`

export const StyledIconWrapper = styled.span`
  position: relative;
  top: 1px;
`