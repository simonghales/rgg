import React from "react"
import { Editable } from "rgg-editor";
import { Player } from "./Player";

const Random: React.FC = () => {
    return (
        <>
            <Editable id="randomA">
                <Player/>
            </Editable>
            <Editable id="randomB">
                <Player/>
            </Editable>
        </>
    )
}

export default Random