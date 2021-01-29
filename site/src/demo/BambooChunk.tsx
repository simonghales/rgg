import React, {useRef} from "react"
import {Box} from "@react-three/drei";
import {useProp} from "../components/Editable";
import {useEditableWidget} from "../misc";
import Bamboo from "./Bamboo/Bamboo";

const BambooChunk: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)
    const width = useProp('width', 2)
    const height = useProp('height', 2)

    const groupRef = useRef<any>()
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Bamboo width={width} height={height} xPos={x} yPos={y}/>
        </group>
    )
}

export default BambooChunk