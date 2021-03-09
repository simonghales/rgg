import React, {MutableRefObject, useState} from "react"
import {BodyStatus} from "@dimforge/rapier3d-compat";
import {useEditableProp} from "./useEditableProp";
import {modulesProp, predefinedPropKeys} from "../editor/componentEditor/config";
import {useEditableSharedProp} from "./Editable";
import {
    ColliderValue,
    RigidBody3dPropValue,
    RigidBodyColliderShape,
    RigidBodyType
} from "../editor/componentEditor/inputs/RigidBody3DInput";
import {Object3D} from "three";
import {AddBodyDef, ColliderDef } from "rgg-engine/dist/physics/helpers/rapier3d/types";
import {useRapier3DBody} from "rgg-engine";
import {useIsEditMode} from "../editor/state/editor";
import {Box, Sphere } from "@react-three/drei";

interface Props {
    value: RigidBody3dPropValue,
}

const getBodyType = (bodyType?: RigidBodyType): BodyStatus => {
    switch (bodyType) {
        case RigidBodyType.STATIC:
            return BodyStatus.Static;
        case RigidBodyType.KINEMATIC:
            return BodyStatus.Kinematic;
        default:
            return BodyStatus.Dynamic;
    }
}

const generateRigidBodyCollider = (collider: ColliderValue): ColliderDef => {
    switch (collider.colliderType) {
        case RigidBodyColliderShape.BALL:
            const {radius = 1} = collider
            return {
                type: 'Ball',
                args: [radius],
            }
        default:
            const {hx = 0.5, hy = 0.5, hz = 0.5} = collider
            return {
                type: 'Cubiod',
                args: [hx, hy, hz],
            }
    }
}

const generateRigidBodyColliders = (colliders: RigidBody3dPropValue['colliders'] = []): ColliderDef[] => {
    const defs: ColliderDef[] = []
    colliders.forEach((collider) => {
        defs.push(generateRigidBodyCollider(collider))
    })
    return defs
}

const generateRigidBodySpec = (config: RigidBody3dPropValue, position: [number, number, number]): AddBodyDef => {

    const colliders = generateRigidBodyColliders(config.colliders)

    const mass = config.mass ?? 1

    return {
        body: {
            type: getBodyType(config.bodyType),
            position: position,
            mass,
        },
        colliders
    }
}

const RigidBody3DModule: React.FC<Props & {
    meshRef: MutableRefObject<Object3D>
}> = ({value, meshRef}) => {

    const {x, y, z} = useEditableProp(predefinedPropKeys.position) ?? {
        x: 0,
        y: 0,
        z: 0,
    }

    // todo - get rotation as well...

    useRapier3DBody(() => generateRigidBodySpec(value, [x, y, z]), {
        ref: meshRef,
    })

    return null
}

const ColliderVisualiser: React.FC<{
    collider: ColliderValue,
}> = ({collider}) => {
    if (collider.colliderType === RigidBodyColliderShape.BALL) {
        const {radius = 1} = collider
        return (
            <Sphere args={[radius + 0.001]} layers={[31]}>
                <meshPhongMaterial color="red" wireframe />
            </Sphere>
        )
    } else if (collider.colliderType === RigidBodyColliderShape.CUBIOD) {
        const {hx = 0.5, hy = 0.5, hz = 0.5} = collider
        return (
            <Box args={[hx * 2, hy * 2, hz * 2]} layers={[31]}>
                <meshPhongMaterial color="red" wireframe />
            </Box>
        )
    }
    return null
}

const RigidBody3DModuleVisualizer: React.FC<Props> = ({value}) => {

    const {colliders = []} = value

    return (
        <>
            {colliders.map((collider) => (
                <ColliderVisualiser collider={collider} key={collider.key}/>
            ))}
        </>
    )
}

const RigidBody3DModuleWrapper: React.FC<Props> = ({value}) => {

    const meshRef = useEditableSharedProp('meshRef')
    const isEditMode = useIsEditMode()

    if (!meshRef) return null

    if (!value.enabled) return null

    return (
        <>
            {
                !isEditMode && (
                    <RigidBody3DModule meshRef={meshRef} value={value}/>
                )
            }
            {
                isEditMode && (
                    <RigidBody3DModuleVisualizer value={value}/>
                )
            }
        </>
    )
}

export const EditableModules: React.FC = ({children}) => {

    useEditableProp(modulesProp.key)
    const rigidBody3d = useEditableProp(predefinedPropKeys.rigidBody3d)

    return (
        <>
            {children}
            {
                rigidBody3d && (
                    <RigidBody3DModuleWrapper value={rigidBody3d}/>
                )
            }
        </>
    )
}