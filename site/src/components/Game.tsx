import React, {useContext} from "react"
import {Canvas} from "react-three-fiber";
import EditProvider, {Context, EditableChildrenContext, useEditContext} from "./EditProvider";
import GameContent from "./GameContent";
import Scene from "./Scene";


const Game: React.FC = () => {
    const context = useEditContext()
    const editableContext = useContext(EditableChildrenContext)
    return (
        <Canvas>
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