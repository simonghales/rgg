import React from "react"
import styled from "styled-components";
import { StyledHeading } from "../../ui/typography";
import {SPACE_UNITS} from "../../ui/units";
import {InputCheckbox} from "../../ui/inputs";
import {FaCaretDown} from "react-icons/fa";
import {cssResetButton} from "../../ui/buttons";
import RigidBodyConfig from "./RigidBodyConfig";

const StyledComponent = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: ${SPACE_UNITS.medium}px;
`

const StyledComponentHeader = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

const StyledOptionsButton = styled.button`
  ${cssResetButton};
`

const SubComponentsMenu: React.FC = () => {
    return (
        <div>
            <ul>
                <li>
                    <StyledComponent>
                        <StyledComponentHeader>
                            <div>
                                <InputCheckbox/>
                            </div>
                            <div>
                                <StyledHeading>RigidBody 3D</StyledHeading>
                            </div>
                            <div>
                                <StyledOptionsButton>
                                    <FaCaretDown/>
                                </StyledOptionsButton>
                            </div>
                        </StyledComponentHeader>
                        <div>
                            <RigidBodyConfig/>
                        </div>
                    </StyledComponent>
                </li>
            </ul>
        </div>
    )
}

export default SubComponentsMenu