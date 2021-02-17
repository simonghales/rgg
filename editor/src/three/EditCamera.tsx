import React, {useEffect, useLayoutEffect, useRef} from "react"
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {PerspectiveCamera as PCamera} from "three";
import {useThree} from "react-three-fiber";
import {editorStateProxy, useIsEditMode, useIsTwoDimensional} from "../state/editor";
import {ref} from "valtio";

const EditCamera: React.FC = () => {

    const isEditMode = useIsEditMode()
    const orbitRef = useRef<OrbitControls>(null as unknown as OrbitControls)
    const cameraRef = useRef<PCamera>(null as unknown as PCamera)
    const {
        setDefaultCamera,
    } = useThree()
    const twoDimensional = useIsTwoDimensional()

    useLayoutEffect(() => {
        if (twoDimensional) {
            cameraRef.current.up.set(0,0,1)
        } else {
            cameraRef.current.up.set(0,1,0)
        }
    }, [twoDimensional])

    useLayoutEffect(() => {
        cameraRef.current.layers.enable(31)
        cameraRef.current.lookAt(0, 0, 0)
        editorStateProxy.orbitRef = ref(orbitRef)
    }, [])

    useLayoutEffect(() => {
        if (isEditMode) {
            setDefaultCamera(cameraRef.current)
        }
    }, [isEditMode])

    useEffect(() => {
        if (!orbitRef.current) return
        orbitRef.current.enabled = isEditMode
    }, [isEditMode])

    useEffect(() => {
        // if (!orbitRef.current) return
        // console.log('add listeners...', orbitRef.current)
        // const onMove = () => {
        //     console.log('start??')
        //     editorMutableState.pendingAddingComponent = false
        // }
        // orbitRef.current.addEventListener('change', onMove)
        // console.log('listening...')
        // return () => {
        //     console.log('unmount?')
        //     orbitRef.current.removeEventListener('change', onMove)
        // }
    }, [])

    return (
        <>
            <PerspectiveCamera position={[0, 0, 20]} ref={cameraRef}/>
            <OrbitControls ref={orbitRef} />
        </>
    )
}

export default EditCamera