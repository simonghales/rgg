import React, {useEffect} from "react"
import {Rapier3DPhysicsConsumer} from "rgg-engine";
import {STEP_RATE} from "./config";
import {useIsEditMode} from "../../src";

const worker = new Worker("../src/webWorker.ts")

const RGGEngine: React.FC = ({children}) => {
    const isEditing = useIsEditMode()
    return (
        <Rapier3DPhysicsConsumer worker={worker} stepRate={STEP_RATE} paused={isEditing}>
            {children}
        </Rapier3DPhysicsConsumer>
    )
}

export default RGGEngine