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
import {Euler, Object3D, Quaternion, Vector3} from "three";
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

const generateRigidBodySpec = (config: RigidBody3dPropValue, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]): AddBodyDef => {

    const colliders = generateRigidBodyColliders(config.colliders)

    const mass = config.mass ?? 1

    const quaternion = getQuaternionFromEuler(rotation[0], rotation[1], rotation[2])

    return {
        body: {
            type: getBodyType(config.bodyType),
            position: position,
            quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
            mass,
        },
        colliders
    }
}

const getQuaternionFromEuler = (x: number, y: number, z: number) => {
    const euler = new Euler(x, y, z)
    const quaternion = new Quaternion()
    quaternion.setFromEuler(euler)
    return quaternion
}

const v3 = new Vector3()

const getMeshWorldPosition = (object: Object3D) => {
    return object.getWorldPosition(v3)
}

const RigidBody3DModule: React.FC<Props & {
    meshRef: MutableRefObject<Object3D>
}> = ({value, meshRef}) => {

    const {
        x: rX,
        y: rY,
        z: rZ,
    } = useEditableProp(predefinedPropKeys.rotation) ?? {
        x: 0,
        y: 0,
        z: 0,
    }

    useRapier3DBody(() => {
        const position = meshRef.current.position
        return generateRigidBodySpec(value, [position.x, position.y, position.z], [rX, rY, rZ])
    }, {
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

const RigidBody3DModuleVisualizer: React.FC<Props & {
    visible: boolean,
}> = ({value, visible}) => {

    const {colliders = []} = value
    const scale = useEditableProp(predefinedPropKeys.scale) ?? {
        x: 1,
        y: 1,
        z: 1,
    }

    return (
        <group visible={visible} scale={[1 / scale.x, 1 / scale.y, 1 / scale.z]}>
            {colliders.map((collider) => (
                <ColliderVisualiser collider={collider} key={collider.key}/>
            ))}
        </group>
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
            <RigidBody3DModuleVisualizer value={value} visible={isEditMode}/>
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