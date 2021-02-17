import React from "react"
import {EditCanvas} from "rgg-editor";
import {Engine} from "react-three-game-engine";
import {Canvas} from "react-three-fiber";
import {useEditCanvasProps} from "../../../src/three/EditCanvas";
import RGGEngine from "../RGGEngine";

const physicsWorker = new Worker("../worker/physics.worker.js")

const GameEngine: React.FC = ({children}) => {

    const editCanvasProps = useEditCanvasProps()

    return (
        <Canvas {...editCanvasProps}>
            <RGGEngine>
                <EditCanvas>
                    {/*<Engine physicsWorker={physicsWorker}>*/}
                        {children}
                    {/*</Engine>*/}
                </EditCanvas>
            </RGGEngine>
        </Canvas>
    )
}

export default GameEngine