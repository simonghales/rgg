import React, {useEffect, useState} from "react";
import {STEP_RATE} from "./config";
import {Rapier3DApp, rawActiveKeys, SyncComponents, useOnFixedUpdate, usePlanckAppContext} from "rgg-engine";
import {BodyStatus, RigidBodyDesc, World} from "@dimforge/rapier3d-compat";
import {ColliderDesc} from "@dimforge/rapier3d-compat";
import {Vector3} from "@dimforge/rapier3d-compat/rapier";
import {RigidBody} from "@dimforge/rapier3d-compat/rapier";

/*

main app, component


 */

const v3 = new Vector3(0, 0, 0)

const keys = {
    up: [87],
    right: [68],
    down: [83],
    left: [65],
}

const isKeyPressed = (codes: number[]) => {
    let pressed = false
    codes.forEach(code => {
        if (rawActiveKeys[code]) {
            pressed = true
        }
    })
    return pressed
}

let vertical = 0
let horizontal = 0
let speed = 0
let newX = 0
let newZ = 0

const Player: React.FC = () => {
    const {
        world,
        addSyncedBody,
        addBody,
    } = usePlanckAppContext()

    const [body, setBody] = useState<RigidBody | null>(null)

    useEffect(() => {

        const rigidBodyDesc = new RigidBodyDesc(BodyStatus.Dynamic);

        rigidBodyDesc.setMass(1)

        // rigidBodyDesc.angularDamping = 100

        rigidBodyDesc.linearDamping = 100

        rigidBodyDesc.restrictRotations(false, false, false)

        rigidBodyDesc.setTranslation(0, 1, 0)

        const body = (world as World).createRigidBody(rigidBodyDesc);

        const collider = ColliderDesc.capsule(0.5, 0.5)

        collider.restitution = 0
        collider.friction = 1

        world.createCollider(collider, body.handle)

        setBody(body)

        // setInterval(() => {
        //     body.setTranslation(new Vector3(5, 0, 5), true)
        // }, 1000)

        return addBody('player', body, true)

        // setTimeout(() => {
        //     body.setTranslation(new Vector3(5, 0, 5), true)
        // }, 2000)

    }, [])

    useOnFixedUpdate((delta) => {
        if (!body) return

        let vertical = 0
        let horizontal = 0
        if (isKeyPressed(keys.up)) {
            vertical = -1
        } else if (isKeyPressed(keys.down)) {
            vertical = 1
        }
        if (isKeyPressed(keys.right)) {
            horizontal = 1
        } else if (isKeyPressed(keys.left)) {
            horizontal = -1
        }

        speed = 2000 * (delta / 1000)

        newX = horizontal * speed
        newZ = vertical * speed

        v3.x = newX
        v3.z = newZ

        body.applyImpulse(v3, true)\

    })

    return null
}

const syncedComponents = {
    player: Player,
}

const Game: React.FC = () => {

    return (
        <>
            <SyncComponents components={syncedComponents}/>
        </>
    )

}

const WorkerApp: React.FC<{
    worker: Worker
}> = ({worker}) => {

    return (
        <Rapier3DApp worker={worker} stepRate={STEP_RATE}>
            <Game/>
        </Rapier3DApp>
    )
};

export default WorkerApp;