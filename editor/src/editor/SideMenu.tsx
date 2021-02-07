import React from "react"
import styled from "styled-components";
import root from 'react-shadow/styled-components';
import {StyledThickerButton} from "../ui/buttons";
import {StyledHeading} from "../ui/typography";
import {COLORS} from "../ui/colors";
import {GlobalStyle} from "../ui/global";
import ComponentsList from "./components/ComponentsList";
import {editorStateProxy, setAddingComponent, useIsAddingComponentToCanvas} from "../state/editor";
import {cssPadding, StyledHeader} from "../ui/shared";

export const StyledWrapper = styled.div`
  height: 100%;
  
  > div {
    height: 100%;
  }
  
`

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const StyledMain = styled.div`
  flex: 1 1 1px;
  overflow: hidden;
`

const StyledFooter = styled.footer`
  ${cssPadding};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${COLORS.faint};
`

const SideMenu: React.FC = () => {

    const isAddingComponent = useIsAddingComponentToCanvas()

    return (
        <StyledWrapper>
            <root.div>
                <GlobalStyle/>
                <StyledContainer>
                    <StyledHeader>
                        <StyledHeading>Scene</StyledHeading>
                    </StyledHeader>
                    <StyledMain>
                        <ComponentsList/>
                    </StyledMain>
                    <StyledFooter>
                        {
                            isAddingComponent ? (
                                <StyledThickerButton full onClick={() => {
                                    editorStateProxy.addComponentKey = ''
                                }}>
                                    Done
                                </StyledThickerButton>
                            ) : (
                                <StyledThickerButton full onClick={() => {
                                    setAddingComponent(true)
                                }}>
                                    Add component
                                </StyledThickerButton>
                            )
                        }
                    </StyledFooter>
                </StyledContainer>
            </root.div>
        </StyledWrapper>
    )
}

export default SideMenu