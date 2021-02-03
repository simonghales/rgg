import React from "react"
import styled from "styled-components";
import {Leva} from "leva/dist/leva.cjs.js";
import EditorProvider from "./EditorProvider";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import { Helmet } from "react-helmet";
import StateMenu from "./state/StateMenu";
import {COLORS} from "../ui/colors";
import AddComponentMenu from "./components/AddComponent/AddComponentMenu";
import {useIsAddingComponent, useIsEditMode} from "../state/editor";
import CameraPreview from "./CameraPreview";
import AddComponentBlocker from "./components/AddComponent/AddComponentBlocker";

const StyledContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #121213;
  color: white;
  flex-direction: column;
`

const StyledMain = styled.div`
  display: flex;
  flex: 1;
`

const StyledAside = styled.div`
  background-color: ${COLORS.darkLighter};
  height: 100%;
  width: 100%;
  max-width: 220px;
  font-size: 14px;
  line-height: 1;
`

const StyledLeft = styled(StyledAside)`
  position: relative;
`

const StyledCenter = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledTop = styled.div`
  background-color: ${COLORS.dark};
  height: 46px;
`

const StyledMainMiddle = styled.div`
  flex: 1;
  position: relative;
`

const StyledRight = styled(StyledAside)`
  display: flex;
  flex-direction: column;
`

const StyledLevaContainer = styled.div`
  flex: 1;
`

export const Editor: React.FC = ({children}) => {

    const isAddingComponent = useIsAddingComponent()
    const isEditMode = useIsEditMode()

    return (
        <>
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
            </Helmet>
            <EditorProvider>
                <StyledContainer>
                    <StyledTop>
                        <TopBar/>
                    </StyledTop>
                    <StyledMain>
                        <StyledLeft>
                            <SideMenu/>
                            {
                                isAddingComponent && (
                                    <AddComponentMenu/>
                                )
                            }
                        </StyledLeft>
                        <StyledCenter>
                            <StyledMainMiddle>
                                {children}
                                {
                                    isEditMode && (
                                        <CameraPreview/>
                                    )
                                }
                                {
                                    isAddingComponent && (
                                        <AddComponentBlocker/>
                                    )
                                }
                            </StyledMainMiddle>
                        </StyledCenter>
                        <StyledRight>
                            <StateMenu/>
                            <StyledLevaContainer>
                                <Leva fillParent/>
                            </StyledLevaContainer>
                        </StyledRight>
                    </StyledMain>
                </StyledContainer>
            </EditorProvider>
        </>
    )
}