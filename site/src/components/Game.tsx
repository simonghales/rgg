import React, {useContext} from "react"
import {Canvas} from "react-three-fiber";
import EditProvider, {Context, EditableChildrenContext, useEditContext} from "./EditProvider";
import Scene from "./Scene";
import GameContent from "../demo/GameContent";


const Game: React.FC = () => {
    const context = useEditContext()
    const {selectComponent} = context
    const editableContext = useContext(EditableChildrenContext)
    return (
        <Canvas shadowMap onPointerMissed={() => selectComponent('', '', [])}>
            <Context.Provider value={context}>
                <EditableChildrenContext.Provider value={editableContext}>
                    <Scene>
                        <GameContent/>
                    </Scene>
                </EditableChildrenContext.Provider>
            </Context.Provider>
        </Canvas>
    )
}

export default Game