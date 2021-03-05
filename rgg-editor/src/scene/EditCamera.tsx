import React, {useEffect, useLayoutEffect, useRef} from "react"
import {PerspectiveCamera as PCamera} from "three";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {useThree} from "react-three-fiber";

const EditCamera: React.FC = () => {
    const cameraRef = useRef<PCamera>(null!)
    const orbitRef = useRef<OrbitControls>(null!)
    const {
        setDefaultCamera,
    } = useThree()

    useEffect(() => {
        setDefaultCamera(cameraRef.current)
    }, [])

    useLayoutEffect(() => {
        cameraRef.current.layers.enable(31)
        cameraRef.current.lookAt(0, 0, 0)
    }, [])

    return (
        <>
            <PerspectiveCamera position={[0, 5, 10]} ref={cameraRef}/>
            <OrbitControls ref={orbitRef} />
        </>
    )
}

export default EditCamera