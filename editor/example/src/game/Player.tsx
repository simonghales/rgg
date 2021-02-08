import React, {useEffect, useRef} from "react"
import {Sphere} from "@react-three/drei";
import {Editable, EditableGrabbable, useEditableProp, useGrabbableMesh} from "rgg-editor";
import {useDraggableMesh} from "../../../src/three/useDraggableMesh";

export const Player: React.FC = () => {

    const {x, y, z} = useEditableProp('position', {
        defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        },
    })

    const speed = useEditableProp('speed', {
        defaultValue: 9,
        config: {
            max: 15,
            min: 5,
            step: 0.01,
        }
    })

    console.log('speed', speed)


    const [ref] = useDraggableMesh({
        translationSnap: 1,
    })

    return (
        <EditableGrabbable>
            <group position={[x, y, z]} ref={ref}>
                <Sphere position={[0, 0, 1]}>
                    <meshBasicMaterial color="red" />
                </Sphere>
            </group>
        </EditableGrabbable>
    )
}

Player.displayName = 'Player'

const PlayerEditable: React.FC = () => {
    return (
        <Editable id="player">
            <Player/>
        </Editable>
    )
}

export default PlayerEditable