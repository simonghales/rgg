import React, {useEffect, useRef} from "react"
import {PerspectiveCamera as OriginalPerspectiveCamera} from "three"
import {PerspectiveCamera} from "@react-three/drei";
import {
    Editable,
    EditableGrabbable, setMainCamera,
    useEditableProp,
    useGrabbableMesh,
    useIsEditMode,
    useSetDefaultCamera,
    useDraggableMesh
} from "rgg-editor";
import {CameraHelper} from "three";
import {useFrame} from "react-three-fiber";

const Camera: React.FC = () => {

    const cameraRef = useRef<OriginalPerspectiveCamera>(null as unknown as OriginalPerspectiveCamera)
    const setDefaultCamera = useSetDefaultCamera()
    const isEditMode = useIsEditMode()

    const {x, y, z} = useEditableProp('position', {defaultValue: {
            x: 0,
            y: 0,
            z: 10,
        }})

    useEffect(() => {
        cameraRef.current.up.set(0,0,1)
        cameraRef.current.lookAt(0, 0, 0)
        setMainCamera(cameraRef.current)
    }, [])

    useFrame(() => {
        cameraRef.current.lookAt(0, 0, 0)
    })

    useEffect(() => {
        if (isEditMode) return
        console.log('setting as default camera??')
        setDefaultCamera(cameraRef.current)
    }, [isEditMode])

    const props = useGrabbableMesh(cameraRef, CameraHelper)
    const [ref] = useDraggableMesh()

    return (
        <group position={[x, y, z]} ref={ref}>
            <PerspectiveCamera {...props} ref={cameraRef} />
        </group>
    )
}

const Wrapper: React.FC = () => {
    return (
        <Editable id="camera">
            <Camera/>
        </Editable>
    )
}

export default Wrapper