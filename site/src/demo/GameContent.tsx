import React from "react"
import Floor from "./Floor";
import Lights from "./Lights";
import Player from "./Player";
import Editable from "../components/Editable";
import {registerComponent} from "../state/editor";
import BambooChunk from "./BambooChunk";
import PlayCamera from "./PlayCamera";
import EngineWrapper from "./EngineWrapper";

registerComponent({
    name: 'Bamboo Chunk',
    key: 'bambooChunk',
    create: () => <BambooChunk/>
})

const GameContent: React.FC = () => {
    return (
        <EngineWrapper>
            <PlayCamera/>
            <Lights/>
            <Editable __id="floor">
                <Floor/>
            </Editable>
            <Editable __id="player">
                <Player/>
            </Editable>
        </EngineWrapper>
    )
}

export default GameContent