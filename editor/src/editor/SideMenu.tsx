import React from "react"
import styled, {css} from "styled-components";
import root from 'react-shadow/styled-components';
import { StyledThickerButton } from "../ui/buttons";
import { StyledHeading } from "../ui/typography";
import {COLORS} from "../ui/colors";
import {GlobalStyle} from "../ui/global";
import {SPACE_UNITS} from "../ui/units";
import ComponentsList from "./components/ComponentsList";
import {setAddingComponent} from "../state/editor";

const cssPadding = css`
  padding: ${SPACE_UNITS.medium}px ${SPACE_UNITS.mediumPlus}px;
`

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

export const StyledHeader = styled.header`
  ${cssPadding};
  border-bottom: 1px solid ${COLORS.faint};
  display: flex;
  align-items: flex-end;
`

const StyledMain = styled.div`
  flex: 1;
`

const StyledFooter = styled.footer`
  ${cssPadding};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${COLORS.faint};
`

const SideMenu: React.FC = () => {
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
                        <StyledThickerButton full onClick={() => {
                            setAddingComponent(true)
                        }}>
                            Add component
                        </StyledThickerButton>
                    </StyledFooter>
                </StyledContainer>
            </root.div>
        </StyledWrapper>
    )
}

export default SideMenu