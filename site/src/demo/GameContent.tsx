import React from "react"
import Floor from "./Floor";
import Lights from "./Lights";
import Player from "./Player";
import Editable from "../components/Editable";
import {registerComponent} from "../state/editor";
import RandomObject from "./RandomObject";

registerComponent({
    name: 'RandomObject',
    key: 'randomObject',
    create: () => <RandomObject/>
})

const GameContent: React.FC = () => {
    return (
        <>
            <Lights/>
            <Editable __id="floor">
                <Floor/>
            </Editable>
            <Editable __id="player">
                <Player/>
            </Editable>
        </>
    )
}

export default GameContent