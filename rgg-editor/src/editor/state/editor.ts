import {proxy, useProxy} from "valtio";
import {OrthographicCamera, PerspectiveCamera} from "three";

export enum EditorTransformMode {
    translate = 'translate',
    rotate = 'rotate',
    scale = 'scale',
}

export const editorStateProxy = proxy<{
    transformMode: EditorTransformMode,
    groupPortalRef: any,
    orbitRef: any,
    selectedRef: any,
    cameraCanvasRef: any,
    mainCamera: null | PerspectiveCamera | OrthographicCamera,
    transformActive: boolean,
    addComponentKey: string,
    movingComponents: string[],
    addComponentPosition: {
        x: number,
        y: number,
        z: number,
    }
}>({
    transformMode: EditorTransformMode.translate,
    groupPortalRef: null,
    orbitRef: null,
    selectedRef: null,
    cameraCanvasRef: null,
    mainCamera: null,
    transformActive: false,
    addComponentKey: '',
    movingComponents: [],
    addComponentPosition: {
        x: 0,
        y: 0,
        z: 0,
    }
})

export const useGroupPortalRef = () => {
    return useProxy(editorStateProxy).groupPortalRef
}

export const useTransformMode = () => {
    return useProxy(editorStateProxy).transformMode
}

export const setTransformMode = (mode: EditorTransformMode) => {
    editorStateProxy.transformMode = mode
}