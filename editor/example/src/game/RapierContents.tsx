import React, {MutableRefObject, useRef} from "react"
import {Plane, Sphere} from "@react-three/drei";
import {useRapier3DBody} from "rgg-engine";
import {BodyStatus} from "@dimforge/rapier3d-compat";
import {Euler, Object3D, Quaternion} from "three";
import {Editable, EditableGrabbable, useDraggableMesh, useEditableProp, useIsEditMode} from "../../../src";

type PhysicsProps = {
    objRef: MutableRefObject<Object3D>,
    position?: [number, number, number]
}

const PhysicsObject: React.FC<PhysicsProps> = ({objRef, position = [0, 0, 0]}) => {
    useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Dynamic,
            position: position,
            mass: 1,
        },
        colliders: [{
            type: 'Ball',
            args: [1],
        }]
    }), {
        ref: objRef,
    })
    return null
}

const PhysicsObjectWrapper: React.FC<PhysicsProps> = (props) => {
    const isEditMode = useIsEditMode()
    if (isEditMode) return null
    return <PhysicsObject {...props}/>
}

const Mesh: React.FC<{
    groupRef: MutableRefObject<Object3D>
}> = ({groupRef}) => {

    useDraggableMesh({
        passedRef: groupRef,
    })

    return (
        <EditableGrabbable>
            <Sphere/>
        </EditableGrabbable>
    )
}

const Custom: React.FC = () => {
    const ref = useRef<any>()
    const includeRigidBody = useEditableProp('includeRigidBody', {
        defaultValue: true,
    })
    const includeMesh = useEditableProp('includeMesh', {
        defaultValue: true,
    })
    const {x, y, z} = useEditableProp('position', {
        defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        },
    })
    const position = [x, y, z] as [number, number, number]
    const isEditing = useIsEditMode()
    return (
        <group ref={ref} position={position} key={isEditing ? 'editing' : 'playing'}>
            {
                includeMesh && (
                    <Mesh groupRef={ref}/>
                )
            }
            {
                includeRigidBody && (
                    <PhysicsObjectWrapper position={position} objRef={ref}/>
                )
            }
        </group>
    )
}

export const Ball: React.FC = () => {

    return (
        <>
            <Custom/>
        </>
    )
}

Ball.displayName = 'Ball'

const RapierContents: React.FC = () => {

    const [ref] = useRapier3DBody(() => ({
        body: {
            type: BodyStatus.Static,
            position: [0, -5, 0],
            quaternion: new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2, 0)).toArray() as any,
        },
        colliders: [{
            type: 'Cubiod',
            args: [20, 10, 20],
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