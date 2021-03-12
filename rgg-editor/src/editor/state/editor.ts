import {proxy, ref, useProxy} from "valtio";
import {OrthographicCamera, PerspectiveCamera} from "three";

export enum EditorTransformMode {
    translate = 'translate',
    rotate = 'rotate',
    scale = 'scale',
}

export const editorStateProxy = proxy<{
    editMode: boolean,
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
    },
}>({
    editMode: false, // todo - set back to true
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

export const useIsEditMode = () => {
    return useProxy(editorStateProxy).editMode
}

export const setEditMode = (editMode: boolean) => {
    editorStateProxy.editMode = editMode
}

export const useGroupPortalRef = () => {
    return useProxy(editorStateProxy).groupPortalRef
}

export const useTransformMode = () => {
    return useProxy(editorStateProxy).transformMode
}

export const setTransformMode = (mode: EditorTransformMode) => {
    editorStateProxy.transformMode = mode
}

export enum PendingPasteType {
    COMPONENTS = 'COMPONENTS'
}

export type PendingPaste = {
    type: PendingPasteType,
    data: any,
}

export const clipboardProxy = proxy<{
    pendingPaste: PendingPaste | null
}>({
    pendingPaste: null,
})

export const addToClipboard = (pendingPaste: PendingPaste) => {
    clipboardProxy.pendingPaste = ref(pendingPaste)
}

export const clearClipboard = () => {
    clipboardProxy.pendingPaste = null
}