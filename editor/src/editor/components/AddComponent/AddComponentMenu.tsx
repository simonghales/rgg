import React, {useCallback} from "react"
import styled from "styled-components";
import OutsideClickHandler from 'react-outside-click-handler';
import {COLORS} from "../../../ui/colors";
import root from "react-shadow/styled-components";
import {StyledWrapper} from "../../SideMenu";
import {GlobalStyle} from "../../../ui/global";
import {setAddingComponent} from "../../../state/editor";
import AddComponent from "./AddComponent";
import {useHotkeys} from "../../../inputs/hooks";

const StyledContainer = styled(StyledWrapper)`
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 220px;
  background-color: ${COLORS.darkLighter};
  z-index: 99999999;
  border-left: 1px solid ${COLORS.dark};
`

const AddComponentMenu: React.FC = () => {

    const onClose = useCallback(() => {
        setAddingComponent(false)
    }, [])

    useHotkeys('esc', onClose)

    return (
        <OutsideClickHandler onOutsideClick={onClose}>
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