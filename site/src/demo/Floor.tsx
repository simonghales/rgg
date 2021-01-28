import React from "react"
import {Plane} from "@react-three/drei";
import {useProp} from "../components/Editable";

const size = 100

const Floor: React.FC = () => {

    const color = useProp('color', '#232324', 'string')

    return (
        <Plane args={[size, size]} receiveShadow>
            <meshStandardMaterial color={color}/>
        </Plane>
    )
}

export default Floor