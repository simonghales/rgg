import React, {MutableRefObject, useMemo, useRef} from "react"
import {Box, Plane, Sphere} from "@react-three/drei";
import {useRapier3DBody} from "rgg-engine";
import {BodyStatus} from "@dimforge/rapier3d-compat";
import {Euler, Object3D, Quaternion} from "three";
import {
    CUSTOM_CONFIG_KEYS,
    EditableGrabbable, RigidBodyCollider, RigidBodyColliderShape,
    RigidBodyState,
    RigidBodyType,
    useDraggableMesh,
    useEditableProp,
    useIsEditMode
} from "../../../src";
import {AddBodyDef, ColliderDef} from "rgg-engine/src/physics/helpers/rapier3d/types";

const usePosition = () => {
    const position = useEditableProp(CUSTOM_CONFIG_KEYS.position, {
        defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        },
    })
    return position as [number, number, number]
}

type PhysicsProps = {
    rigidBody3d: RigidBodyState,
    objRef: MutableRefObject<Object3D>,
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

const generateRigidBodyCollider = (collider: RigidBodyCollider): ColliderDef => {
    switch (collider.shape) {
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

const generateRigidBodyColliders = (colliders: RigidBodyState['colliders'] = {}): ColliderDef[] => {
    const defs: ColliderDef[] = []
    Object.values(colliders).forEach((collider) => {
        defs.push(generateRigidBodyCollider(collider))
    })
    return defs
}

const generateRigidBodySpec = (config: RigidBodyState, position: [number, number, number]): AddBodyDef => {

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

const PhysicsObject: React.FC<PhysicsProps> = ({rigidBody3d, objRef}) => {

    const position = usePosition()

    useRapier3DBody(() => generateRigidBodySpec(rigidBody3d, position), {
        ref: objRef,
    })

    return null
}

const ColliderVisualiser: React.FC<{
    collider: ColliderDef
}> = ({collider}) => {
    if (collider.type === "Ball") {
        return (
            <Sphere args={[collider.args[0] + 0.001]} layers={[31]}>
                <meshPhongMaterial color="red" wireframe />
            </Sphere>
        )
    } else if (collider.type === 'Cubiod') {
        return (
            <Box args={(collider.args as [number, number, number]).map((arg) => arg * 2) as [number, number, number]} layers={[31]}>
                <meshPhongMaterial color="red" wireframe />
            </Box>
        )
    }
    return null
}

const Visualizer: React.FC<{
    rigidBody3d: RigidBodyState
}> = ({rigidBody3d}) => {

    const colliders = generateRigidBodyColliders(rigidBody3d.colliders)

    return (
        <>
            {colliders.map((collider, index) => (
                <ColliderVisualiser collider={collider} key={`${collider.type}:${index}`}/>
            ))}
        </>
    )
}

const PhysicsObjectWrapper: React.FC<PhysicsProps> = ({rigidBody3d, ...props}) => {
    const isEditMode = useIsEditMode()
    return (
        <>
            {
                !isEditMode && (
                    <PhysicsObject rigidBody3d={rigidBody3d} {...props}/>
                )
            }
            {
                isEditMode && (
                    <Visualizer rigidBody3d={rigidBody3d}/>
                )
            }
        </>
    )
}

const Mesh: React.FC<{
    groupRef: MutableRefObject<Object3D>
}> = ({groupRef, children}) => {

    useDraggableMesh({
        passedRef: groupRef,
    })

    return (
        <EditableGrabbable>
            {children}
        </EditableGrabbable>
    )
}

const Custom: React.FC = ({children}) => {
    const ref = useRef<any>()
    useEditableProp(CUSTOM_CONFIG_KEYS.customConfig)
    const rigidBody3d = useEditableProp(CUSTOM_CONFIG_KEYS.rigidBody3d)
    const position = useEditableProp(CUSTOM_CONFIG_KEYS.position, {
        defaultValue: [0, 0, 0]
    })

    const isEditing = useIsEditMode()
    return (
        <group ref={ref} position={position} key={isEditing ? 'editing' : 'playing'}>
            {
                children && (
                    <Mesh groupRef={ref}>
                        {children}
                    </Mesh>
                )
            }
            {
                rigidBody3d && rigidBody3d.enabled && (
                    <PhysicsObjectWrapper rigidBody3d={rigidBody3d} objRef={ref}/>
                )
            }
        </group>
    )
}

export const Ball: React.FC = () => {

    return (
        <>
            <Custom>
                <Sphere args={[1]}/>
            </Custom>
        </>
    )
}

Ball.displayName = 'Ball'

export const CustomBox: React.FC = () => {

    const scale = useEditableProp('_scale', {
        defaultValue: [1, 1, 1]
    })

    return (
        <>
            <Custom>
                <Box scale={scale}>
                    <meshBasicMaterial color="blue" />
                </Box>
            </Custom>
        </>
    )
}

CustomBox.displayName = 'Box'

const RapierContents: React.FC = () => {

    return null

    const [ref] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Static,
            position: [0, -5, 0],
            quaternion: new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2, 0)).toArray() as any,
        },
        colliders: [{
            type: 'Cubiod',
            args: [10, 5, 10],
        }]
    }))

    return (
        <>
            <group ref={ref}>
                <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
                    <meshBasicMaterial color="black" />
                </Plane>
            </group>
        </>
    )
}

export default RapierContents