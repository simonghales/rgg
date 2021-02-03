import React from "react"
import Lights from "./Lights";
import Player from "./Player";
import Random from "./Random";
import Camera from "./Camera";
import "./registeredComponents"

const GameContents: React.FC = () => {
    return (
        <>
            <Lights/>
            <Camera/>
            <Player/>
            <Random/>
        </>
    )
}

export default GameContents