import {createGlobalStyle} from "styled-components";
import reset from "styled-reset"
import {COLORS} from "./colors";

export const GlobalStyle = createGlobalStyle`
  ${reset};
  :host {
    box-sizing: border-box;
    color: ${COLORS.lightPurple};
    font-size: 14px;
    line-height: 1;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
  }
  
`