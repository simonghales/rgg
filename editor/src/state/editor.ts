import create from "zustand";
import {proxy, ref, useProxy} from "valtio";
import {ComponentStateData} from "./componentsState";
import {useEffect, useRef} from "react";
import {OrthographicCamera, PerspectiveCamera} from "three";

export const editorMutableState = {
    pendingAddingComponent: false,
}

export const editorStateProxy = proxy<{
    orbitRef: any,
    cameraCanvasRef: any,
    mainCamera: null | PerspectiveCamera | OrthographicCamera,
    transformActive: boolean,
    addComponentKey: string,
    addComponentPosition: {
        x: number,
        y: number,
    }
}>({
    orbitRef: null,
    cameraCanvasRef: null,
    mainCamera: null,
    transformActive: false,
    addComponentKey: '',
    addComponentPosition: {
        x: 0,
        y: 0,
    }
})

export const setAddComponentKey = (uid: string) => {
    editorStateProxy.addComponentKey = uid
}

export const useAddComponentKey = () => {
    return useProxy(editorStateProxy).addComponentKey
}

export const useIsAddingComponentToCanvas = () => {
    const addComponentKey = useAddComponentKey()
    return !!addComponentKey
}

export const useIsCanvasInteractable = () => {
    return !useIsAddingComponentToCanvas()
}

export const setMainCamera = (camera: PerspectiveCamera | OrthographicCamera) => {
    editorStateProxy.mainCamera = ref(camera)
}

export const useMainCamera = () => {
    return useProxy(editorStateProxy).mainCamera
}

export const useOrbitRef = () => {
    return useProxy(editorStateProxy).orbitRef
}

type StoreState = {
    activeComponentState: {
        [key: string]: ComponentStateData | null
    },
    addingComponent: boolean,
    editMode: boolean,
}

export const useEditorStore = create<StoreState>(() => ({
    activeComponentState: {},
    addingComponent: false,
    editMode: true,
}))

export const useIsEditMode = () => {
    return useEditorStore(state => state.editMode)
}

export const useIsEditModeRef = () => {
    const isEditMode = useIsEditMode()
    const ref = useRef(isEditMode)
    useEffect(() => {
        ref.current = isEditMode
    }, [isEditMode])
    return ref
}

export const setEditMode = (editMode: boolean) => {
    useEditorStore.setState({
        editMode,
    })
}

export const useIsAddingComponent = () => {
    return useEditorStore(state => state.addingComponent)
}

export const setAddingComponent = (addingComponent: boolean) => {
    useEditorStore.setState({addingComponent})
}

export const setActiveComponentState = (uid: string, activeComponentState: ComponentStateData | null) => {
    useEditorStore.setState(state => ({
        activeComponentState: {
                ...state.activeComponentState,
                [uid]: activeComponentState,
        },
    }))
}

export const useActiveComponentState = (uid: string) => {
    return useEditorStore(state => state.activeComponentState[uid])
}