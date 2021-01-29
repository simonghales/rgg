import React from "react"
import {Engine} from "react-three-game-engine";

// @ts-ignore
import PhysicsWorker from './physicsWorker/physics.worker';
import InputsHandler from "./inputs/InputsHandler";

const physicsWorker = new PhysicsWorker()

const EngineWrapper: React.FC = ({children}) => {
    return (
        <Engine physicsWorker={physicsWorker}>
            <InputsHandler>
                {children}
            </InputsHandler>
        </Engine>
    )
}

export default EngineWrapper