import React, {Suspense, useContext} from "react"
import {Canvas} from "react-three-fiber";
import EditProvider, {Context, EditableChildrenContext, useEditContext} from "./EditProvider";
import {Engine, InstancesProvider, InstancedMesh} from "react-three-game-engine";
import Scene from "./Scene";
import GameContent from "../demo/GameContent";
import EditCamera from "./EditCamera";


const Game: React.FC = () => {
    const context = useEditContext()
    const {selectComponent} = context
    const editableContext = useContext(EditableChildrenContext)
    return (
        <Canvas shadowMap onPointerMissed={() => selectComponent('', '', [])}>
            <EditCamera/>
            <Context.Provider value={context}>
                <InstancesProvider>
                    <Suspense fallback={null}>
                        <InstancedMesh maxInstances={1000} meshKey="bamboo" gltfPath="/models/Bamboo_4.glb" meshProps={{castShadow: true, receiveShadow: true}}/>
                    </Suspense>
                    <EditableChildrenContext.Provider value={editableContext}>
                        <Scene>
                            <GameContent/>
                        </Scene>
                    </EditableChildrenContext.Provider>
                </InstancesProvider>
            </Context.Provider>
        </Canvas>
    )
}

export default Game