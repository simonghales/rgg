import React, {useEffect, useRef} from "react"
import {useThree} from "react-three-fiber";
import {useIsEditMode} from "../state/global";
import {PerspectiveCamera} from "three";

const EditCamera: React.FC = () => {

    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()
    const isEditMode = useIsEditMode()

    useEffect(() => {
        if (isEditMode) {
            setDefaultCamera(cameraRef.current)
        }
    }, [isEditMode])

    return (
        <perspectiveCamera ref={cameraRef} position={[0, 0, 20]}/>
    )
}

export default EditCamera