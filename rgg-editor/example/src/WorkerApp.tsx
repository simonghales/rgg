import React, {useEffect, useState} from "react";
import {STEP_RATE} from "./config";
import {Rapier3DApp, rawActiveKeys, SyncComponents, useOnFixedUpdate, usePlanckAppContext} from "rgg-engine";
import {BodyStatus, RigidBodyDesc} from "@dimforge/rapier3d-compat";
import {ColliderDesc} from "@dimforge/rapier3d-compat";
import {Vector3, Vector, Rotation, Quaternion} from "@dimforge/rapier3d-compat/rapier";
import {RigidBody, World} from "@dimforge/rapier3d-compat/rapier";

/*

main app, component


 */

const v3 = new Vector3(0, 0, 0)
let playerTranslation = new Vector3(0, 0, 0)

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

const colliderDesc = ColliderDesc.capsule(0.5, 0.5);

const getCollisionGroups = (myGroups: number[], interactGroups: number[]) => {
    let result = 0;
    for (let g of myGroups)
    {
        result += (1 << g);
    }
    result = result << 16;

    for (let f of interactGroups)
    {
        result += (1 << f);
    }
    return result;
}

const Player: React.FC = () => {
    const {
        world: worldApp,
        addSyncedBody,
        addBody,
    } = usePlanckAppContext()

    const world: World = worldApp as World

    const [body, setBody] = useState<RigidBody | null>(null)

    useEffect(() => {

        // rigidBodyDesc.angularDamping = 100

        // rigidBodyDesc.linearDamping = 100

        const rigidBodyDesc = new RigidBodyDesc(BodyStatus.Kinematic);

        rigidBodyDesc.setMass(1)

        rigidBodyDesc.restrictRotations(false, false, false)

        rigidBodyDesc.setTranslation(0, 1.01, 0)

        const body = (world as World).createRigidBody(rigidBodyDesc);

        colliderDesc.restitution = 0;
        colliderDesc.friction = 1;
        colliderDesc.setCollisionGroups(getCollisionGroups([1], [0]))

        const collider = world.createCollider(colliderDesc, body.handle);

        console.log('collider', collider)

        setBody(body)

        setInterval(() => {



        }, 1000)

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

        speed = 5

        // speed = 2000 * (delta / 1000)
        //
        newX = horizontal * speed
        newZ = vertical * speed

        playerTranslation = body.translation()

        v3.x = playerTranslation.x += (newX * (delta / 1000))
        v3.y = playerTranslation.y
        v3.z = playerTranslation.z += (newZ * (delta / 1000))

        const result = world.castShape(
            world.colliders,
            body.translation(),
            body.rotation(),
            new Vector3(newX, 0, newZ),
            colliderDesc.shape,
            (delta / 1000),
            0x0001_0001,
        );

        if (result) {
            console.log('result', result)
            console.log('translation:', body.translation())
            console.log('rotation:', body.rotation())
            console.log('velocity', new Vector3(newX, 0, newZ))
            console.log('result', result)
            console.log('intended destination', v3)
            if (result.toi === 0) return
            console.log('MATCH!')
            v3.x = result.witness1.x
            v3.z = result.witness1.z

        }

        body.setTranslation(v3, true)



        //
        // v3.x = newX
        // v3.z = newZ
        //
        // body.applyImpulse(v3, true)

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