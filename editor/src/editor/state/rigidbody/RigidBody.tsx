import React, {useEffect, useMemo, useState} from "react"
import styled, {css} from "styled-components";
import {SPACE_UNITS} from "../../../ui/units";
import {StyledButton} from "../../../ui/buttons";
import {InputCheckbox} from "../../../ui/inputs";
import {StyledHeading} from "../../../ui/typography";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import RigidBodyConfig from "./RigidBodyConfig";
import {ComponentIndividualStateData} from "../../../state/main/types";
import {updateComponentModifiedState} from "../../../state/main/actions";
import {RIGIDBODY_3D_KEY} from "../SubComponentsMenu";
import {useComponentId} from "../ComponentStateMenu.context";

const cssCollapsed = css`
    grid-row-gap: 0;
`

const StyledComponent = styled.div<{
    collapsed?: boolean,
}>`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: ${SPACE_UNITS.medium}px;
  ${props => props.collapsed ? cssCollapsed : ''};
`

const StyledComponentHeader = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

const StyledComponentBody = styled.div`
`

const StyledOptionsButton = styled(StyledButton)``

const isEnabled = (state: ComponentIndividualStateData) => {
    return state.value && state.value.enabled
}

const RigidBody: React.FC<{
    state: ComponentIndividualStateData,
}> = ({state}) => {

    const [enabled, setEnabled] = useState(isEnabled(state))
    const [expanded, setExpanded] = useState(true)
    const componentId = useComponentId()

    useEffect(() => {
        updateComponentModifiedState(componentId, RIGIDBODY_3D_KEY, (value: any) => {
            return {
                ...value,
                enabled,
            }
        })
    }, [enabled, componentId])

    const {
        toggleExpanded,
    } = useMemo(() => ({
        toggleExpanded: () => {
            setExpanded(state => !state)
        }
    }), [])

    return (
        <StyledComponent collapsed={!expanded}>
            <StyledComponentHeader>
                <div>
                    <InputCheckbox checked={enabled} onChange={setEnabled}/>
                </div>
                <div>
                    <StyledHeading inactive={!enabled}>RigidBody 3D</StyledHeading>
                </div>
                <div>
                    <StyledOptionsButton onClick={toggleExpanded}>
                        {
                            expanded ? (
                                <FaCaretDown/>
                            ) : (
                                <FaCaretUp/>
                            )
                        }
                    </StyledOptionsButton>
                </div>
            </StyledComponentHeader>
            {
                expanded && (
                    <StyledComponentBody>
                        <RigidBodyConfig state={state}/>
                    </StyledComponentBody>
                )
            }
        </StyledComponent>
    )
}

export default RigidBody