import React from "react"
import styled from "styled-components";
import OutsideClickHandler from 'react-outside-click-handler';
import {COLORS} from "../../../ui/colors";
import root from "react-shadow/styled-components";
import {StyledWrapper} from "../../SideMenu";
import {GlobalStyle} from "../../../ui/global";
import {setAddingComponent} from "../../../state/editor";
import AddComponent from "./AddComponent";

const StyledContainer = styled(StyledWrapper)`
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 220px;
  background-color: ${COLORS.darkLighter};
  z-index: 999;
  border-left: 1px solid ${COLORS.dark};
`

const AddComponentMenu: React.FC = () => {

    return (
        <OutsideClickHandler onOutsideClick={() => {
            setAddingComponent(false)
        }}>
            <StyledContainer>
                <root.div>
                        <GlobalStyle/>
                        <AddComponent/>
                </root.div>
            </StyledContainer>
        </OutsideClickHandler>
    )
}

export default AddComponentMenu