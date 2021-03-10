import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {useThree} from "react-three-fiber";
import { TransformControls as OriginalTransformControls } from "three/examples/jsm/controls/TransformControls";
// @ts-ignore
import { TransformControls as CustomTransformControls } from "../custom/TransformControls"
import {Object3D, Vector3} from "three";
import {useHotkeys} from "../custom/hooks";
import {setComponentPropValue} from "../editor/state/main/actions";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {useProxy} from "valtio";
import {editorStateProxy, EditorTransformMode, useIsEditMode, useTransformMode} from "../editor/state/editor";
import {EDITOR_LAYER} from "./InteractiveMesh";
import {isShiftPressed} from "../editor/hotkeys";
import {storeSnapshot} from "../editor/state/history/actions";

const TransformControls: any = CustomTransformControls

const recursiveSetLayer = (object: Object3D) => {
    // if (object.children.length === 0) {
        object.layers.set(EDITOR_LAYER)
    // } else {
        object.children.forEach((child) => recursiveSetLayer(child))
    // }
}

export const useIsCanvasInteractable = () => {
    return true
}

export const useDraggableMesh = (id: string, isSelected: boolean, options: {
    translationSnap?: number,
    passedRef?: MutableRefObject<Object3D>,
    updateValue?: (key: string, value: any, startValue: any) => void,
    onChange?: () => void,
    onDraggingChanged?: (event: any) => void,
} = {}) => {
    const { camera, gl, scene } = useThree()
    const isEditMode = useIsEditMode()
    const localRef = useRef<Object3D>(null!)
    const ref = options.passedRef ?? localRef
    const orbitRef = useProxy(editorStateProxy).orbitRef
    const [controls, setControls] = useState<OriginalTransformControls | null>(null)
    const isCanvasEnabled = useIsCanvasInteractable()
    const [shiftIsPressed, setShiftIsPressed] = useState<boolean>(isShiftPressed())
    const {updateValue, onChange, onDraggingChanged: passedOnDraggingChanged} = options

    useHotkeys('*', () => {
        setShiftIsPressed(isShiftPressed())
    }, {
        keyup: true,
        keydown: true,
    })

    useEffect(() => {
        const callback = () => {
            setShiftIsPressed(isShiftPressed())
        }
        document.addEventListener('keyup', callback)
        return () => {
            document.removeEventListener('keyup', callback)
        }
    }, [])

    const active = isEditMode && isSelected && isCanvasEnabled

    // @ts-ignore
    useEffect(() => {
        if (!controls) return
        const currentTranslationSnap = controls.translationSnap
        const currentRotationSnap = controls.rotationSnap
        if (shiftIsPressed) {
            controls.setTranslationSnap(1)
            controls.setRotationSnap(1)
            return () => {
                controls.setTranslationSnap(currentTranslationSnap)
                controls.setRotationSnap(currentRotationSnap)
            }
        }
    }, [shiftIsPressed, controls])

    const startPositionRef = useRef(new Vector3())

    useEffect(() => {
        if (!orbitRef || !controls) return
        const onDraggingChanged = (event: any) => {
            startPositionRef.current.copy(ref.current.position)
            editorStateProxy.transformActive = event.value
            if (orbitRef.current) {
                orbitRef.current.enabled = !event.value
            }
            if (passedOnDraggingChanged) {
                passedOnDraggingChanged(event)
            }
        }

        controls.addEventListener('dragging-changed', onDraggingChanged)
        if (onChange) {
            controls.addEventListener('change', onChange)
        }
        return () => {
            editorStateProxy.transformActive = false
            if (orbitRef.current) {
                orbitRef.current.enabled = true
            }
            if (onChange) {
                controls.removeEventListener('change', onChange)
            }
            controls.removeEventListener('dragging-changed', onDraggingChanged)
        }
    }, [orbitRef, controls])

    const transformMode = useTransformMode()

    const onMouseUp = useCallback(() => {
        if (!ref.current) return
        storeSnapshot()
        console.log('MOUSE UP!')

        if (transformMode === EditorTransformMode.translate) {
            const {x, y, z} = ref.current.position
            const update = {
                x,
                y,
                z
            }
            if (updateValue) {
                updateValue(predefinedPropKeys.position, update, startPositionRef.current)
            } else {
                setComponentPropValue(id, predefinedPropKeys.position, {
                    x,
                    y,
                    z,
                })
            }
        } else if (transformMode === EditorTransformMode.rotate) {
            const {x, y, z} = ref.current.rotation
            const update = {
                x,
                y,
                z
            }
            if (updateValue) {
                updateValue(predefinedPropKeys.rotation, update, startPositionRef.current)
            } else {
                setComponentPropValue(id, predefinedPropKeys.rotation, {
                    x,
                    y,
                    z,
                })
            }
        } else if (transformMode === EditorTransformMode.scale) {
            const {x, y, z} = ref.current.scale
            const update = {
                x,
                y,
                z
            }
            if (updateValue) {
                updateValue(predefinedPropKeys.scale, update, startPositionRef.current)
            } else {
                setComponentPropValue(id, predefinedPropKeys.scale, {
                    x,
                    y,
                    z,
                })
            }
        }

    }, [transformMode])

    const onMouseUpRef = useRef(onMouseUp)

    useEffect(() => {
        onMouseUpRef.current = onMouseUp
    }, [onMouseUp])

    useEffect(() => {

        if (!active) return
        if (!ref.current) return
        const controls = new TransformControls(camera, gl.domElement)
        const {translationSnap} = options
        if (translationSnap != undefined) {
            controls.setTranslationSnap(translationSnap)
        }
        controls.raycaster.layers.enable(EDITOR_LAYER)
        recursiveSetLayer(controls)
        setControls(controls)
        controls.attach(ref.current as Object3D)
        controls.addEventListener('mouseUp', () => {

            onMouseUpRef.current()

        })
        scene.add(controls)

        return () => {
            controls.detach()
            scene.remove(controls)
            setControls(null)
        }

    }, [active])

    useEffect(() => {
        controls?.setMode(transformMode)
    }, [controls, transformMode])

    return [ref]
}