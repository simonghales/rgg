import styled, {css} from "styled-components";
import {SPACE_UNITS} from "./units";
import {COLORS} from "./colors";

export const cssPadding = css`
  padding: ${SPACE_UNITS.medium}px ${SPACE_UNITS.mediumPlus}px;
`
export const StyledHeader = styled.header`
  ${cssPadding};
  border-bottom: 1px solid ${COLORS.faint};
  display: flex;
  align-items: flex-end;
`