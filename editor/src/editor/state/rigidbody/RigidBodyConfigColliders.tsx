import React from "react"
import styled from "styled-components";
import { StyledPlainButton } from "../../../ui/buttons";
import {cssContainer, cssLabel} from "../../../ui/inputs/NumberInput";
import {SPACE_UNITS} from "../../../ui/units";
import {COLORS} from "../../../ui/colors";
import ColliderConfig from "./ColliderConfig";

const StyledContainer = styled.div`
  margin-top: ${SPACE_UNITS.small}px;
  padding: ${SPACE_UNITS.small}px;
  border: 1px solid ${COLORS.faint};
  margin-left: -${SPACE_UNITS.small}px;
  margin-right: -${SPACE_UNITS.small}px;
`

const StyledHeader = styled.header`
  ${cssContainer};
`

const StyledHeading = styled.h4`
  ${cssLabel};
`

const StyledList = styled.ul`
  margin-top: ${SPACE_UNITS.small}px;
  
  > li {
    border-top: 1px solid ${COLORS.faint};
    margin-left: -${SPACE_UNITS.small}px;
    margin-right: -${SPACE_UNITS.small}px;
    padding-left: ${SPACE_UNITS.small}px;
    padding-right: ${SPACE_UNITS.small}px;
    padding-top: ${SPACE_UNITS.small}px;
    
    &:not(:first-child) {
      margin-top: ${SPACE_UNITS.small}px;
    }
    
  }
  
`

const RigidBodyConfigColliders: React.FC = () => {
    return (
        <StyledContainer>
            <StyledHeader>
                <StyledHeading>Colliders</StyledHeading>
                <div>
                    <StyledPlainButton full>
                        Add Collider
                    </StyledPlainButton>
                </div>
            </StyledHeader>
            <StyledList>
                <li>
                    <ColliderConfig/>
                </li>
            </StyledList>
        </StyledContainer>
    )
}

export default RigidBodyConfigColliders