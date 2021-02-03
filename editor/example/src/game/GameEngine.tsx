import React from "react"
import {EditCanvas} from "rgg-editor";
import {Engine} from "react-three-game-engine";
import {Canvas} from "react-three-fiber";

const physicsWorker = new Worker("../worker/physics.worker.js")

const GameEngine: React.FC = ({children}) => {
    return (
        <Canvas>
            <EditCanvas>
                <Engine physicsWorker={physicsWorker}>
                    {children}
                </Engine>
            </EditCanvas>
        </Canvas>
    )
}

export default GameEngine