import React, {useEffect, useState} from "react"
import {PerspectiveCamera, WebGLRenderer} from "three";
import {useProxy} from "valtio";
import {editorStateProxy, useIsEditMode, useMainCamera} from "../state/editor";
import {useFrame, useThree} from "react-three-fiber";

const CameraPreviewHandler: React.FC<{
    canvasElement: HTMLCanvasElement,
}> = ({canvasElement}) => {

    const [renderer] = useState(() => new WebGLRenderer({canvas: canvasElement}))
    const {scene} = useThree()
    const mainCamera = useMainCamera() as PerspectiveCamera

    useEffect(() => {
        if (!mainCamera) return
        mainCamera.aspect = canvasElement.width / canvasElement.height
        mainCamera.updateProjectionMatrix();
    }, [mainCamera])

    useFrame(() => {
        if (!mainCamera) return
        // @ts-ignore
        renderer.render(scene, mainCamera)
    })

    return null
}

const Wrapper: React.FC = () => {

    const canvasElement = useProxy(editorStateProxy).cameraCanvasRef
    const isEditMode = useIsEditMode()

    if (!isEditMode) return null

    if (!canvasElement) return null

    return <CameraPreviewHandler canvasElement={canvasElement as HTMLCanvasElement}/>

}

export default Wrapper