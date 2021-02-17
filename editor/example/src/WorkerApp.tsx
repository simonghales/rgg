import React from "react";
import {STEP_RATE} from "./config";
import {Rapier3DApp} from "rgg-engine";

const WorkerApp: React.FC<{
    worker: Worker
}> = ({worker}) => {
    return (
        <Rapier3DApp worker={worker} stepRate={STEP_RATE}/>
    )
};

export default WorkerApp;