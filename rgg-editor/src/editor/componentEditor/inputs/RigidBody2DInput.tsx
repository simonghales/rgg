import React, {useMemo} from "react"
import {InputProps} from "./TextInput";
import {
    RigidBodyInput, StyledCollidersContainer, StyledCollidersHeader,
    StyledInputLabel,
    StyledInputWrapper,
    useRigidBodyInput
} from "./RigidBody3DInput";
import {SelectInput} from "./SelectInput";
import {StyledPlainButton} from "../../ui/buttons";

export enum RigidBody2dType {
    DYNAMIC = 'DYNAMIC',
    STATIC = 'STATIC',
    KINEMATIC = 'KINEMATIC',
}

const options = [
    {
        value: RigidBody2dType.DYNAMIC,
        label: 'Dynamic',
    },
    {
        value: RigidBody2dType.STATIC,
        label: 'Static',
    },
    {
        value: RigidBody2dType.KINEMATIC,
        label: 'Kinematic',
    },
]

export type RigidBody2dColliderValue = {
    key: string,
    colliderType: RigidBody2dColliderShape,
}

export type RigidBody2dPropValue = {
    enabled?: boolean,
    bodyType?: RigidBody2dType,
    colliders?: RigidBody2dColliderValue[],
}

export enum RigidBody2dColliderShape {
    CIRCLE = 'CIRCLE',
    BOX = 'BOX',
}

export const RigidBody2DInput: React.FC<InputProps> = ({
                                                           value,
                                                           inputId,
                                                           onChange: passedOnChange,
                                                       }) => {

    const {
        propKey,
        propType,
        componentId,
        componentTypeId,
        enabled,
        onEnabledChanged,
        setIsExpanded,
        isExpanded,
    } = useRigidBodyInput({value, inputId, onChange: passedOnChange})

    const {
        bodyType = RigidBody2dType.DYNAMIC,
        colliders = [],
    } = value as RigidBody2dPropValue

    const {
        addCollider
    } = useMemo(() => ({
        addCollider: () => {
            const newCollider: RigidBody2dColliderValue = {
                key: Date.now().toString(),
                colliderType: RigidBody2dColliderShape.CIRCLE,
            }
            const updatedValue = {
                ...value,
                colliders: colliders.concat([newCollider])
            }
            passedOnChange(updatedValue)
        }
    }), [])

    return (
        <RigidBodyInput propKey={propKey} label="RigidBody 2D"
                        propType={propType}
                        componentId={componentId}
                        componentTypeId={componentTypeId}
                        optionsInputValue={value}
                        inputId={inputId}
                        enabled={enabled}
                        onEnabledChanged={onEnabledChanged}
                        setIsExpanded={setIsExpanded}
                        isExpanded={isExpanded}>
            <div>
                <StyledInputWrapper>
                    <StyledInputLabel htmlFor="rigidBody2d-type">
                        Type
                    </StyledInputLabel>
                    <div>
                        <SelectInput inputId="rigidBody2d-type" value={bodyType} onChange={(newValue: any) => {
                            const updatedValue = {
                                ...value,
                                bodyType: newValue,
                            }
                            passedOnChange(updatedValue)
                        }} options={options}/>
                    </div>
                </StyledInputWrapper>
                <StyledCollidersContainer>
                    <StyledCollidersHeader>
                        <div>
                            <StyledInputLabel>
                                Colliders
                            </StyledInputLabel>
                        </div>
                        <StyledPlainButton shape="thinnerWide" onClick={addCollider}>
                            Add Collider
                        </StyledPlainButton>
                    </StyledCollidersHeader>
                </StyledCollidersContainer>
            </div>
        </RigidBodyInput>
    )
}
