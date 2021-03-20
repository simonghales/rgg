import React, {useEffect, useLayoutEffect, useRef} from "react"
import {PerspectiveCamera as PCamera, Vector3} from "three";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {useThree} from "react-three-fiber";
import {ref, useProxy} from "valtio";
import {editorStateProxy, useIsEditMode} from "../editor/state/editor";
import {useCallbackRef, useHotkeys} from "../custom/hooks";
import {isSpacePressed} from "../editor/hotkeys";

const offsets = {
    x: 0,
    // y: 2,
    // z: 5,
    y: 25,
    z: 20,
}

const EditCamera: React.FC = () => {
    const cameraRef = useRef<PCamera>(null!)
    const orbitRef = useRef<OrbitControls>(null!)
    const isEditMode = useIsEditMode()
    const {
        setDefaultCamera,
    } = useThree()

    useLayoutEffect(() => {
        if (isEditMode) {
            setDefaultCamera(cameraRef.current)
        }
    }, [isEditMode])

    useEffect(() => {
        editorStateProxy.orbitRef = ref(orbitRef)
    }, [])

    useEffect(() => {
        if (!orbitRef.current) return
        orbitRef.current.enabled = isEditMode
    }, [isEditMode])

    useLayoutEffect(() => {
        cameraRef.current.layers.enable(31)
        cameraRef.current.lookAt(0, 5, 0)
    }, [])

    const selectedRef = useProxy(editorStateProxy).selectedRef

    const spacePressed = useCallbackRef(() => {
        if (selectedRef) {
            if (selectedRef) {
                cameraRef.current.position.set(selectedRef.current.position.x + offsets.x, selectedRef.current.position.y + offsets.y, selectedRef.current.position.z + offsets.z)
                orbitRef.current.target = new Vector3().copy(selectedRef.current.position)
            }
        }
    }, [selectedRef])

    useHotkeys('*', () => {
        if (isSpacePressed()) {
            spacePressed.current()
        }
    })

    useEffect(() => {
        cameraRef.current.position.set(offsets.x, offsets.y, offsets.z)
    }, [])

    return (
        <>
            <PerspectiveCamera ref={cameraRef}/>
            <OrbitControls ref={orbitRef} />
        </>
    )
}

export default EditCamera