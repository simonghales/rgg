import styled, {css} from "styled-components";

export const FONT_WEIGHTS = {
    bold: 700,
}

const cssInactive = css`
  opacity: 0.5;
`

export const StyledHeading = styled.h3<{
    inactive?: boolean,
}>`
  font-size: 0.8rem;
  font-weight: ${FONT_WEIGHTS.bold};
  
  ${props => props.inactive ? cssInactive : ''};
`