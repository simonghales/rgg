import React, {useMemo, useState} from "react"
import SelectInput, {SelectInputOption} from "../../../ui/inputs/SelectInput";
import styled from "styled-components";
import {SPACE_UNITS} from "../../../ui/units";
import NumberInput from "../../../ui/inputs/NumberInput";
import { StyledButton } from "../../../ui/buttons";
import {FaTimes} from "react-icons/fa";
import {RigidBodyColliderShape} from "./types";

const StyledList = styled.ul`

    > li {

      &:not(:first-child) {
        margin-top: ${SPACE_UNITS.small}px;
      }
      
    }

`

const StyledTypeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

const options: SelectInputOption[] = [
    {
        value: RigidBodyColliderShape.BALL,
        label: 'Ball',
    },
    {
        value: RigidBodyColliderShape.CUBIOD,
        label: 'Cubiod',
    },
]

const BallConfig: React.FC = () => {
    return (
        <>
            <li>
                <NumberInput label="Radius" value={1}/>
            </li>
        </>
    )
}

const CubiodConfig: React.FC = () => {
    return (
        <>
            <li>
                <NumberInput label="hx" value={0.5}/>
            </li>
            <li>
                <NumberInput label="hy" value={0.5}/>
            </li>
            <li>
                <NumberInput label="hz" value={0.5}/>
            </li>
        </>
    )
}

const ColliderConfig: React.FC = () => {

    const [shape, setShape] = useState<string>(RigidBodyColliderShape.BALL)
    const config = useMemo(() => {
        switch (shape) {
            case RigidBodyColliderShape.BALL:
                return <BallConfig/>
            case RigidBodyColliderShape.CUBIOD:
                return <CubiodConfig/>
            default:
                return null
        }
    }, [shape])

    return (
        <div>
            <StyledList>
                <li>
                    <StyledTypeContainer>
                        <SelectInput onChange={setShape} value={shape} label="Shape" options={options}/>
                        <div>
                            <StyledButton>
                                <FaTimes size={12}/>
                            </StyledButton>
                        </div>
                    </StyledTypeContainer>
                </li>
                {config}
            </StyledList>
        </div>
    )
}

export default ColliderConfig