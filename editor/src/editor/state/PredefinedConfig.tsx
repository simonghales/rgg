import React, {useCallback, useEffect, useRef, useState} from "react"
import {ComponentIndividualStateData, ComponentStateData} from "../../state/main/types";
import {CUSTOM_CONFIG_KEYS} from "./SubComponentsMenu";
import styled from "styled-components";
import {SPACE_UNITS} from "../../ui/units";
import NumberInput, {cssLabel} from "../../ui/inputs/NumberInput";
import {useUpdateValue} from "./rigidbody/hooks";

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
  padding: 0 ${SPACE_UNITS.medium}px;
`

const StyledMain = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

const StyledLabel = styled.label`
  ${cssLabel};
`

const InputBlock: React.FC<{
    label: string,
    state: ComponentIndividualStateData,
    defaultState?: [number, number, number],
    onChange: (value: any) => void,
}> = ({label, state, defaultState, onChange}) => {


    const [value, setValue] = useState<[number, number, number]>(state.value ?? (defaultState || [0, 0, 0]))
    const firstMountRef = useRef(true)
    const [x, y, z] = value

    useEffect(() => {
        if (firstMountRef.current) {
            firstMountRef.current = false
            return
        }
        onChange(value)
    }, [value])

    return (
        <StyledContainer>
            <div>
                <StyledLabel>
                    {label}
                </StyledLabel>
            </div>
            <StyledMain>
                <div>
                    <NumberInput verticalLayout noMinWidthLabel label={"x"} value={x} onChange={(newValue) => {
                        setValue(valueState => {
                            return [newValue, valueState[1], valueState[2]]
                        })
                    }}/>
                </div>
                <div>
                    <NumberInput verticalLayout noMinWidthLabel label={"y"} value={y} onChange={(newValue) => {
                        setValue(valueState => {
                            return [valueState[0], newValue, valueState[2]]
                        })
                    }}/>
                </div>
                <div>
                    <NumberInput verticalLayout noMinWidthLabel label={"z"} value={z} onChange={(newValue) => {
                        setValue(valueState => {
                            return [valueState[0], valueState[1], newValue]
                        })
                    }}/>
                </div>
            </StyledMain>
        </StyledContainer>
    )
}

const StyledWrapper = styled.ul`
  margin-top: ${SPACE_UNITS.small}px;
    
    > li {
      
      &:not(:first-child) {
        margin-top: ${SPACE_UNITS.small}px;
      }
      
    }
    
`

const PredefinedConfig: React.FC<{
    state: ComponentStateData
}> = ({state}) => {

    const updatePosition = useUpdateValue(CUSTOM_CONFIG_KEYS.position)
    const updateScale = useUpdateValue(CUSTOM_CONFIG_KEYS.scale)

    const onPositionChange = useCallback((position: [number, number, number]) => {
        updatePosition(position)
    }, [])

    const onScaleChange = useCallback((scale: [number, number, number]) => {
        updateScale(scale)
    }, [])

    return (
        <StyledWrapper>
            {
                state[CUSTOM_CONFIG_KEYS.position] && (
                    <li>
                        <InputBlock label="Position" state={state[CUSTOM_CONFIG_KEYS.position]} onChange={onPositionChange}/>
                    </li>
                )
            }
            {
                state[CUSTOM_CONFIG_KEYS.scale] && (
                    <li>
                        <InputBlock label="Scale" defaultState={[1, 1, 1]} state={state[CUSTOM_CONFIG_KEYS.scale]} onChange={onScaleChange}/>
                    </li>
                )
            }
        </StyledWrapper>
    )
}

export default PredefinedConfig