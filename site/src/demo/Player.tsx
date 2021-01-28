import { Box } from "@react-three/drei"
import React, {useRef} from "react"
import {useProp} from "../components/Editable";
import {useEditableWidget} from "../misc";

const Player: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    const groupRef = useRef<any>()
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Box args={[0.5, 0.5, 1]} castShadow receiveShadow position={[0, 0, 0.5]}>
                <meshStandardMaterial color="red" />
            </Box>
        </group>
    )
}

export default Player