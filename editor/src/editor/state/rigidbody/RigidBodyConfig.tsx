import React, {useEffect, useState} from "react"
import NumberInput from "../../../ui/inputs/NumberInput";
import styled from "styled-components";
import SelectInput, {SelectInputOption} from "../../../ui/inputs/SelectInput";
import RigidBodyConfigColliders from "./RigidBodyConfigColliders";
import {ComponentIndividualStateData} from "../../../state/main/types";
import {useComponentId} from "../ComponentStateMenu.context";
import {updateComponentModifiedState} from "../../../state/main/actions";
import {RIGIDBODY_3D_KEY} from "../SubComponentsMenu";

const StyledList = styled.ul`

    > li {
      
      &:not(:first-child) {
        margin-top: 4px;
      }
      
    }

`

export enum RigidBodyType {
    DYNAMIC = 'DYNAMIC',
    STATIC = 'STATIC',
    KINEMATIC = 'KINEMATIC',
}

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

const DynamicConfig: React.FC = () => {
    return (
        <li>
            <NumberInput label="Mass" value={1}/>
        </li>
    )
}

const getBodyType = (state: ComponentIndividualStateData) => {
    return state.value?.bodyType ?? RigidBodyType.DYNAMIC
}

const RigidBodyConfig: React.FC<{
    state: ComponentIndividualStateData,
}> = ({state}) => {

    const [bodyType, setBodyType] = useState<string>(getBodyType(state))
    const componentId = useComponentId()

    useEffect(() => {
        updateComponentModifiedState(componentId, RIGIDBODY_3D_KEY, (value: any) => {
            return {
                ...value,
                bodyType,
            }
        })
    }, [componentId, bodyType])

    return (
        <div>
            <StyledList>
                <li>
                    <SelectInput onChange={setBodyType} value={bodyType} label="Type" options={options}/>
                </li>
                {
                    bodyType === RigidBodyType.DYNAMIC && (
                        <DynamicConfig/>
                    )
                }
            </StyledList>
            <div>
                <RigidBodyConfigColliders/>
            </div>
        </div>
    )
}

export default RigidBodyConfig