import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

export const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #121213;
    color: white;
    font-size: 14px;
    line-height: 1.1;
  }

  html,
  body {
    overscroll-behavior-y: contain;
    overscroll-behavior-x: contain;
  }

  canvas {
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    outline:0;
    -webkit-tap-highlight-color:rgba(255,255,255,0);
  }
  
`