import React, {useEffect} from "react";
import {STEP_RATE} from "./config";
import {Rapier3DApp, SyncComponents, usePlanckAppContext} from "rgg-engine";
import {BodyStatus, RigidBodyDesc, World} from "@dimforge/rapier3d-compat";
import {ColliderDesc} from "@dimforge/rapier3d-compat";
import {Vector3} from "@dimforge/rapier3d-compat/rapier";

/*

main app, component


 */

const Player: React.FC = () => {
    const {
        world,
        addSyncedBody,
        addBody,
    } = usePlanckAppContext()

    useEffect(() => {

        const rigidBodyDesc = new RigidBodyDesc(BodyStatus.Kinematic);

        rigidBodyDesc.setMass(1)

        rigidBodyDesc.restrictRotations(false, false, false)

        rigidBodyDesc.setTranslation(0, 1, 0)

        const body = (world as World).createRigidBody(rigidBodyDesc);

        const collider = ColliderDesc.capsule(0.5, 0.5)

        world.createCollider(collider, body.handle)

        // setInterval(() => {
        //     body.setTranslation(new Vector3(5, 0, 5), true)
        // }, 1000)

        return addBody('player', body, true)

        // setTimeout(() => {
        //     body.setTranslation(new Vector3(5, 0, 5), true)
        // }, 2000)

    }, [])

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