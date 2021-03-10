import React from "react"
import {useIsEditMode} from "../editor/state/editor";

const EditFloor: React.FC = () => {
    const twoDimensional = false
    const isEditMode = useIsEditMode()
    return (
        <>
            <gridHelper visible={isEditMode} position={[0, 0, -0.01]} args={[1000, 1000, '#888', '#111']} rotation={[twoDimensional ? Math.PI / 2 : 0, 0, 0]} layers={[31]}/>
        </>
    )
}

export default EditFloor