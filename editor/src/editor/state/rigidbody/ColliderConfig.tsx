import React, {useCallback, useMemo, useState} from "react"
import SelectInput, {SelectInputOption} from "../../../ui/inputs/SelectInput";
import styled from "styled-components";
import {SPACE_UNITS} from "../../../ui/units";
import NumberInput from "../../../ui/inputs/NumberInput";
import { StyledButton } from "../../../ui/buttons";
import {FaTimes} from "react-icons/fa";
import {RigidBodyCollider, RigidBodyColliderShape, RigidBodyState} from "./types";
import {useSyncValue, useUpdateValue} from "./hooks";
import {CUSTOM_CONFIG_KEYS} from "../SubComponentsMenu";
import {getColliderCubiodSizes, getColliderRadius} from "./state";

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

const BallConfig: React.FC<{
    update: (state: any, value: any) => void,
    radius: number,
}> = ({update, radius: passedRadius}) => {
    const [radius, setRadius] = useState(passedRadius)

    useSyncValue(radius, (value: any, state: any) => {
        return update(state, (colliderState: any) => {
            return {
                ...colliderState,
                radius: value,
            }
        })
    })

    return (
        <>
            <li>
                <NumberInput label="Radius" value={radius} onChange={setRadius}/>
            </li>
        </>
    )
}

const CubiodConfig: React.FC<{
    update: (state: any, value: any) => void,
    hx: number,
    hy: number,
    hz: number,
}> = ({update, hx: passedHx, hy: passedHy, hz: passedHz}) => {

    const [hx, setHx] = useState(passedHx)
    const [hy, setHy] = useState(passedHy)
    const [hz, setHz] = useState(passedHz)

    useSyncValue(hx, (value: any, state: any) => {
        return update(state, (colliderState: any) => {
            return {
                ...colliderState,
                hx: value,
            }
        })
    })

    useSyncValue(hy, (value: any, state: any) => {
        return update(state, (colliderState: any) => {
            return {
                ...colliderState,
                hy: value,
            }
        })
    })

    useSyncValue(hz, (value: any, state: any) => {
        return update(state, (colliderState: any) => {
            return {
                ...colliderState,
                hz: value,
            }
        })
    })

    return (
        <>
            <li>
                <NumberInput label="hx" value={hx} onChange={setHx}/>
            </li>
            <li>
                <NumberInput label="hy" value={hy} onChange={setHy}/>
            </li>
            <li>
                <NumberInput label="hz" value={hz} onChange={setHz}/>
            </li>
        </>
    )
}

const ColliderConfig: React.FC<{
    collider: RigidBodyCollider,
    id: string,
}> = ({collider, id}) => {

    const [shape, setShape] = useState<string>(collider.shape)

    const updateValue = useUpdateValue(CUSTOM_CONFIG_KEYS.rigidBody3d)

    const updateCollider = useCallback((state: RigidBodyState, value: any) => {
        return {
            ...state,
            colliders: {
                ...state.colliders,
                [id]: typeof value === 'function' ? value(state.colliders ? state.colliders[id] ?? {} : {}) : value,
            }
        }
    }, [])

    const config = useMemo(() => {
        switch (shape) {
            case RigidBodyColliderShape.BALL:
                return <BallConfig radius={getColliderRadius(collider)} update={updateCollider}/>
            case RigidBodyColliderShape.CUBIOD:
                return <CubiodConfig {...getColliderCubiodSizes(collider)} update={updateCollider}/>
            default:
                return null
        }
    }, [shape])

    useSyncValue(shape, (value, state) => {
        return {
            ...state,
            colliders: {
                ...state.colliders,
                [id]: {
                    ...state.colliders[id],
                    shape: value,
                }
            }
        }
    })

    const {
        deleteCollider,
    } = useMemo(() => ({
        deleteCollider: () => {
            updateValue((state: RigidBodyState) => {
                const updatedColliders = {
                    ...state.colliders,
                }
                delete updatedColliders[id]
                return {
                    ...state,
                    colliders: updatedColliders
                }
            })
        }
    }), [])

    return (
        <div>
            <StyledList>
                <li>
                    <StyledTypeContainer>
                        <SelectInput onChange={setShape} value={shape} label="Shape" options={options}/>
                        <div>
                            <StyledButton onClick={deleteCollider}>
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