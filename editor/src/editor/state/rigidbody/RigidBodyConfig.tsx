import React, {useCallback, useState} from "react"
import NumberInput from "../../../ui/inputs/NumberInput";
import styled from "styled-components";
import SelectInput, {SelectInputOption} from "../../../ui/inputs/SelectInput";
import RigidBodyConfigColliders from "./RigidBodyConfigColliders";
import {ComponentIndividualStateData} from "../../../state/main/types";
import {useSyncValue} from "./hooks";
import {getMass} from "./state";
import {RigidBodyState, RigidBodyType} from "./types";

const StyledList = styled.ul`

    > li {
      
      &:not(:first-child) {
        margin-top: 4px;
      }
      
    }

`

const options: SelectInputOption[] = [
    {
        value: RigidBodyType.DYNAMIC,
        label: 'Dynamic',
    },
    {
        value: RigidBodyType.STATIC,
        label: 'Static',
    },
    {
        value: RigidBodyType.KINEMATIC,
        label: 'Kinematic',
    },
]

const DynamicConfig: React.FC<{
    state: ComponentIndividualStateData,
}> = ({state}) => {

    const [mass, setMass] = useState(getMass(state))

    useSyncValue(mass, useCallback((value: any, state: any) => {
        return {
            ...state,
            mass: value,
        }
    }, []))

    return (
        <li>
            <NumberInput label="Mass" value={mass} onChange={setMass}/>
        </li>
    )
}

const getBodyType = (state: ComponentIndividualStateData) => {
    const value: RigidBodyState = state.value
    return value?.bodyType ?? RigidBodyType.DYNAMIC
}

const RigidBodyConfig: React.FC<{
    state: ComponentIndividualStateData,
}> = ({state}) => {

    const [bodyType, setBodyType] = useState<string>(getBodyType(state))

    useSyncValue(bodyType, useCallback((value: any, state: any) => {
        return {
            ...state,
            bodyType: value,
        }
    }, []))

    return (
        <div>
            <StyledList>
                <li>
                    <SelectInput onChange={setBodyType} value={bodyType} label="Type" options={options}/>
                </li>
                {
                    bodyType === RigidBodyType.DYNAMIC && (
                        <DynamicConfig state={state}/>
                    )
                }
            </StyledList>
            <div>
                <RigidBodyConfigColliders state={state}/>
            </div>
        </div>
    )
}

export default RigidBodyConfig