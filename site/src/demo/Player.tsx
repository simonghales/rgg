import { Box } from "@react-three/drei"
import React, {MutableRefObject, useCallback, useRef} from "react"
import {useProp} from "../components/Editable";
import {useEditableWidget} from "../misc";
import Ninja from "./3d/Ninja/Ninja";
import {BodyApi, BodyType, createCircleFixture, useBody, useFixedUpdate, useStoreMesh} from "react-three-game-engine";
import {Group, Object3D} from "three";
import {useIsEditMode} from "../state/global";
import {Vec2} from "planck-js";
import {lerpRadians, vectorToAngle} from "../utils/angles";
import {inputsRawState} from "./inputs/state";
import {useFrame} from "react-three-fiber";

const velocity = Vec2(0, 0)
const v2 = Vec2(0, 0)

const useController = (ref: MutableRefObject<Object3D>, api: BodyApi) => {

    const localRef = useRef({
        angle: 0,
    })

    const getMoveVelocity = useCallback((): [number, number] => {
        let xVel = 0
        let yVel = 0

        xVel = inputsRawState.horizontal
        yVel = inputsRawState.vertical

        return [xVel, yVel]
    }, [])

    const onFrame = useCallback((state: any, delta: number) => {

        const [xVel, yVel] = getMoveVelocity()

        const moving = xVel !== 0 || yVel !== 0

        let newAngle = localRef.current.angle

        if (moving) {
            const angle = vectorToAngle(xVel, yVel * -1)
            localRef.current.angle = angle
            newAngle = angle
        }

        ref.current.rotation.z = lerpRadians(ref.current.rotation.z, newAngle, delta * 10)

        // localState.moving = moving

    }, [api, ref, localRef, getMoveVelocity])

    const onFixedUpdate = useCallback((delta: number) => {

        const [xVel, yVel] = getMoveVelocity()

        velocity.set(xVel * 1000 * delta, yVel * 1000 * delta)

        api.applyLinearImpulse(velocity, v2)

    }, [api, getMoveVelocity])

    useFrame(onFrame)
    useFixedUpdate(onFixedUpdate)

}

const PlayModePlayer: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)
    const groupRef = useRef<Group>(new Group())
    useStoreMesh('player', groupRef.current)

    const [,api] = useBody(() => ({
        type: BodyType.dynamic,
        position: Vec2(x, y),
        linearDamping: 15,
        fixtures: [
            createCircleFixture({radius: 0.55, fixtureOptions: {
                    density: 20,
                }})
        ],
    }), {
        uuid: 'player',
        fwdRef: groupRef,
    })

    useController(groupRef, api)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Ninja moving={false} rotation={[Math.PI / 2, 0, 0]} scale={[0.65, 0.65, 0.65]}/>
        </group>
    )
}

const EditModePlayer: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    const groupRef = useRef<Group>(new Group())
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Ninja moving={false} rotation={[Math.PI / 2, 0, 0]} scale={[0.65, 0.65, 0.65]}/>
        </group>
    )
}

const Player: React.FC = () => {
    const isEditMode = useIsEditMode()
    return isEditMode ? <EditModePlayer/> : <PlayModePlayer/>
}

export default Player