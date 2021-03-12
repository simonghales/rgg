import React, {useMemo, useState} from "react"
import {FaCaretDown, FaCaretUp, FaTimes} from "react-icons/fa";
import { styled } from "../../ui/sitches.config";
import {StyledPlainButton} from "../../ManagerSidebar";
import {NumberInput} from "./NumberInput";
import {SelectInput} from "./SelectInput";
import {InputProps} from "./TextInput";
import {PropOrigin} from "../../state/props";
import {PropInputOptions} from "./Options";
import {usePropContext} from "../ComponentModules";
import { StyledBox } from "../../ui/generics";

const StyledContainer = styled('div', {
    padding: '$3',
    borderTop: '1px solid $faint',
})

const StyledHeader = styled('div', {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'auto 1fr auto',
    columnGap: '$2',
})

const StyledLabel = styled('label', {
    fontSize: '$1b',
    fontWeight: '$semi',
})

const StyledInputWrapper = styled('div', {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'auto 1fr',
    columnGap: '$2',
    marginTop: '$2',
})

const StyledInputLabel = styled('label', {
    minWidth: '60px',
    display: 'inline-grid',
    fontSize: '$1b',
})

const StyledBody = styled('div', {
    marginTop: '$3',
})

const StyledCollidersContainer = styled('div', {
    border: '1px solid $faint',
    marginLeft: '-$2',
    marginRight: '-$2',
    maxWidth: 'none',
    marginTop: '$2',
})

const StyledCollidersHeader = styled('header', {
    padding: '$2',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: '$2',
    alignItems: 'center',
})

export enum RigidBodyColliderShape {
    BALL = 'BALL',
    CUBIOD = 'CUBIOD',
}

export enum RigidBodyType {
    DYNAMIC = 'DYNAMIC',
    STATIC = 'STATIC',
    KINEMATIC = 'KINEMATIC',
}

const options = [
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

export type ColliderValue = {
    key: string,
    colliderType: RigidBodyColliderShape,
    hx?: number,
    hy?: number,
    hz?: number,
    radius?: number,
}

export type RigidBody3dPropValue = {
    enabled?: boolean,
    bodyType?: RigidBodyType,
    mass?: number,
    colliders?: ColliderValue[],
    customBodyDef?: {
        [key: string]: any,
    }
}

const StyledColliderContainer = styled('div', {
    padding: '$2',
    borderTop: '1px solid $faint',
})

const RigidBody3DColliderInput: React.FC<{
    collider: ColliderValue,
    onChange: (newValue: any) => void,
    onDelete: () => void,
}> = ({collider, onChange, onDelete}) => {
    const {colliderType, key, radius = 1, hx = 0.5, hy = 0.5, hz = 0.5} = collider
    const {
        updateValue,
    } = useMemo(() => ({
        updateValue: (newValue: any,) => {
            const updatedCollider = {
                ...collider,
                ...newValue,
            }
            onChange(updatedCollider)
        }
    }), [onChange])
    return (
        <StyledColliderContainer>
            <StyledInputWrapper css={{
                gridTemplateColumns: 'auto 1fr auto',
                marginTop: '0',
            }}>
                <StyledInputLabel htmlFor={`${key}-shape`}>
                    Shape
                </StyledInputLabel>
                <div>
                    <SelectInput inputId={`${key}-shape`} value={colliderType} onChange={(newValue: any) => {
                        updateValue({
                            colliderType: newValue,
                        })
                    }} options={[{
                        value: RigidBodyColliderShape.BALL,
                        label: 'Ball',
                    }, {
                        value: RigidBodyColliderShape.CUBIOD,
                        label: 'Cubiod',
                    }]}/>
                </div>
                <div>
                    <button onClick={onDelete}>
                        <FaTimes size={11}/>
                    </button>
                </div>
            </StyledInputWrapper>
            {
                colliderType === RigidBodyColliderShape.BALL && (
                    <>
                        <StyledInputWrapper>
                            <StyledInputLabel htmlFor={`${key}-radius`}>
                                Radius
                            </StyledInputLabel>
                            <NumberInput inputId={`${key}-radius`} value={radius} onChange={(newValue: any) => {
                                updateValue({
                                    radius: newValue,
                                })
                            }}/>
                        </StyledInputWrapper>
                    </>
                )
            }
            {
                colliderType === RigidBodyColliderShape.CUBIOD && (
                    <>
                        <StyledInputWrapper>
                            <StyledInputLabel htmlFor={`${key}-hx`}>
                                hx
                            </StyledInputLabel>
                            <NumberInput inputId={`${key}-hx`} value={hx} onChange={(newValue: any) => {
                                updateValue({
                                    hx: newValue,
                                })
                            }}/>
                        </StyledInputWrapper>
                        <StyledInputWrapper>
                            <StyledInputLabel htmlFor={`${key}-hy`}>
                                hy
                            </StyledInputLabel>
                            <NumberInput inputId={`${key}-hy`} value={hy} onChange={(newValue: any) => {
                                updateValue({
                                    hy: newValue,
                                })
                            }}/>
                        </StyledInputWrapper>
                        <StyledInputWrapper>
                            <StyledInputLabel htmlFor={`${key}-hz`}>
                                hz
                            </StyledInputLabel>
                            <NumberInput inputId={`${key}-hz`} value={hz} onChange={(newValue: any) => {
                                updateValue({
                                    hz: newValue,
                                })
                            }}/>
                        </StyledInputWrapper>
                    </>
                )
            }
        </StyledColliderContainer>
    )
}

export const RigidBody3DInput: React.FC<InputProps> = ({
    value,
    inputId,
    onChange: passedOnChange,
                                                       }) => {

    const [isExpanded, setIsExpanded] = useState(true)

    const {
        enabled = true,
        bodyType = RigidBodyType.DYNAMIC,
        mass = 1,
        colliders = [],
    } = value as RigidBody3dPropValue

    const {
        addCollider,
        updateCollider,
        deleteCollider,
    } = useMemo(() => ({
        addCollider: () => {
            const newCollider: ColliderValue = {
                key: Date.now().toString(),
                colliderType: RigidBodyColliderShape.BALL,
            }
            const updatedValue = {
                ...value,
                colliders: colliders.concat([newCollider])
            }
            passedOnChange(updatedValue)
        },
        updateCollider: (index: number, newValue: any) => {
            const updatedColliders = colliders.slice()
            updatedColliders[index] = newValue
            const updatedValue = {
                ...value,
                colliders: updatedColliders,
            }
            passedOnChange(updatedValue)
        },
        deleteCollider: (index: number,) => {
            const updatedColliders = colliders.slice()
            updatedColliders.splice(index, 1)
            const updatedValue = {
                ...value,
                colliders: updatedColliders,
            }
            passedOnChange(updatedValue)
        }
    }), [value, colliders])

    const {
        propKey,
        propType,
        componentTypeId,
        componentId,
    } = usePropContext()

    return (
        <StyledContainer>
            <StyledHeader>
                <div>
                    <input id={inputId} type="checkbox" checked={enabled} onChange={(event) => {
                        const updatedValue = {
                            ...value,
                            enabled: event.target.checked,
                        }
                        passedOnChange(updatedValue)
                    }}/>
                </div>
                <StyledBox css={{
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: '$0b',
                }}>
                    <StyledLabel htmlFor={inputId}>RigidBody 3D</StyledLabel>
                    <PropInputOptions propKey={propKey} propType={propType as PropOrigin} componentId={componentId} componentTypeId={componentTypeId} inputValue={value}/>
                </StyledBox>
                <div>
                    <button onClick={() => {
                        setIsExpanded(state => !state)
                    }}>
                        {
                            isExpanded ? (
                                <FaCaretUp/>
                            ) : (
                                <FaCaretDown/>
                            )
                        }
                    </button>
                </div>
            </StyledHeader>
            {
                isExpanded && (
                    <StyledBody>
                        <StyledInputWrapper>
                            <StyledInputLabel htmlFor="rigidBody3d-type">
                                Type
                            </StyledInputLabel>
                            <div>
                                <SelectInput inputId="rigidBody3d-type" value={bodyType} onChange={(newValue: any) => {
                                    const updatedValue = {
                                        ...value,
                                        bodyType: newValue,
                                    }
                                    passedOnChange(updatedValue)
                                }} options={options}/>
                            </div>
                        </StyledInputWrapper>
                        {
                            (bodyType === RigidBodyType.DYNAMIC) && (
                                <StyledInputWrapper>
                                    <StyledInputLabel htmlFor="rigidBody3d-mass">
                                        Mass
                                    </StyledInputLabel>
                                    <div>
                                        <NumberInput inputId="rigidBody3d-mass" value={mass} onChange={(newValue: any) => {
                                            const updatedValue = {
                                                ...value,
                                                mass: newValue,
                                            }
                                            passedOnChange(updatedValue)
                                        }}/>
                                    </div>
                                </StyledInputWrapper>
                            )
                        }
                        <StyledCollidersContainer>
                            <StyledCollidersHeader>
                                <div>
                                    <StyledInputLabel>
                                        Colliders
                                    </StyledInputLabel>
                                </div>
                                <StyledPlainButton shape="thinnerWide" onClick={addCollider}>Add Collider</StyledPlainButton>
                            </StyledCollidersHeader>
                            {
                                colliders.length > 0 && (
                                    <div>
                                        {
                                            colliders.map((collider, index) => (
                                                <div key={collider.key}>
                                                    <RigidBody3DColliderInput collider={collider} onChange={(newValue: any) => {
                                                        updateCollider(index, newValue)
                                                    }} onDelete={() => {
                                                        deleteCollider(index)
                                                    }}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </StyledCollidersContainer>
                    </StyledBody>
                )
            }
        </StyledContainer>
    )
}