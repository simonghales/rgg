import React, {useRef} from "react"
import {Box} from "@react-three/drei";
import {useProp} from "../components/Editable";
import {useEditableWidget} from "../misc";

const RandomObject: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    const groupRef = useRef<any>()
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Box args={[0.5, 0.5, 1]} castShadow receiveShadow position={[0, 0, 0.5]}>
                <meshStandardMaterial color="blue" />
            </Box>
        </group>
    )
}

export default RandomObject