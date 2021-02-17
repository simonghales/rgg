import {registerComponent} from "rgg-editor";
import React from "react";
import Scenery from "./Scenery";
import {Ball} from "./RapierContents";

registerComponent('scenery', 'Scenery', () => <Scenery/>, {
    transformPlace: (position: [number, number, number]) => {
        return position.map(pos => Math.round(pos))
    }
})

registerComponent('ball', 'Ball', () => <Ball/>)