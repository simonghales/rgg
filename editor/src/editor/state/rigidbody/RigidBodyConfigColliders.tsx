import React, {useMemo} from "react"
import styled from "styled-components";
import {StyledPlainButton} from "../../../ui/buttons";
import {cssContainer, cssLabel} from "../../../ui/inputs/NumberInput";
import {SPACE_UNITS} from "../../../ui/units";
import {COLORS} from "../../../ui/colors";
import ColliderConfig from "./ColliderConfig";
import {ComponentIndividualStateData} from "../../../state/main/types";
import {getColliders} from "./state";
import {RigidBodyCollider, RigidBodyColliderShape} from "./types";
import {generateUuid} from "../../../utils/ids";
import {CUSTOM_CONFIG_KEYS} from "../SubComponentsMenu";
import {useUpdateValue} from "./hooks";

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

const createNewCollider = (): RigidBodyCollider => {
    return {
        shape: RigidBodyColliderShape.CUBIOD,
    }
}

const RigidBodyConfigColliders: React.FC<{
    state: ComponentIndividualStateData
}> = ({state}) => {

    const colliders = Object.entries(getColliders(state))
    const updateValue = useUpdateValue(CUSTOM_CONFIG_KEYS.rigidBody3d)

    const {
        addNewCollider
    } = useMemo(() => ({
        addNewCollider: () => {
            const collider = createNewCollider()
            const key = generateUuid()
            updateValue((valueState: any) => {
                return {
                    ...valueState,
                    colliders: {
                        ...(valueState.colliders ?? {}),
                        [key]: collider,
                    }
                }
            })
        }
    }), [])

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledHeading>Colliders</StyledHeading>
                <div>
                    <StyledPlainButton full onClick={addNewCollider}>
                        Add Collider
                    </StyledPlainButton>
                </div>
            </StyledHeader>
            {
                colliders.length > 0 && (
                    <StyledList>
                        {
                            colliders.map(([key, collider]) => (
                                <li key={key}>
                                    <ColliderConfig collider={collider} id={key}/>
                                </li>
                            ))
                        }
                    </StyledList>
                )
            }
        </StyledContainer>
    )
}

export default RigidBodyConfigColliders