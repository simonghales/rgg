import {MutableRefObject, useEffect, useRef, useState} from "react";
import {useEditableContext} from "../editable/context";
import {useThree} from "react-three-fiber";
import { TransformControls as OriginalTransformControls } from "three/examples/jsm/controls/TransformControls";
// @ts-ignore
import { TransformControls as CustomTransformControls } from "../custom/TransformControls"
import {Object3D} from "three";
import {editorStateProxy, useIsCanvasInteractable, useIsEditMode, useOrbitRef} from "../state/editor";
import {useHotkeys} from "../inputs/hooks";
import {useIsOnlyComponentSelected} from "../state/main/hooks";
import {updateComponentModifiedState} from "../state/main/actions";
import hotkeys from "hotkeys-js";
import {CUSTOM_CONFIG_KEYS} from "../editor/state/SubComponentsMenu";

const TransformControls: any = CustomTransformControls

const recursiveSetLayer = (object: Object3D) => {
    // if (object.children.length === 0) {
        object.layers.set(31)
    // } else {
        object.children.forEach((child) => recursiveSetLayer(child))
    // }
}

export const useDraggableMesh = (options: {
    translationSnap?: number,
    passedRef?: MutableRefObject<Object3D>,
} = {}) => {
    const { camera, gl, scene } = useThree()
    const {uid, getStateValue} = useEditableContext()
    const isEditMode = useIsEditMode()
    const isSelected = useIsOnlyComponentSelected(uid)
    const localRef = useRef<Object3D>()
    const ref = options.passedRef ?? localRef
    const orbitRef = useOrbitRef()
    const [controls, setControls] = useState<OriginalTransformControls | null>(null)
    const isCanvasEnabled = useIsCanvasInteractable()
    const [shiftIsPressed, setShiftIsPressed] = useState<boolean>(hotkeys.shift)

    useHotkeys('*', () => {
        setShiftIsPressed(hotkeys.shift)
    }, {
        keyup: true,
    })

    const active = isEditMode && isSelected && isCanvasEnabled

    // @ts-ignore
    useEffect(() => {
        if (!controls) return
        const currentTranslationSnap = controls.translationSnap
        if (shiftIsPressed) {
            controls.setTranslationSnap(1)
            return () => {
                controls.setTranslationSnap(currentTranslationSnap)
            }
        }
    }, [shiftIsPressed, controls])

    useEffect(() => {
        if (!orbitRef || !controls) return
        const onDraggingChanged = (event: any) => {
            editorStateProxy.transformActive = event.value
            if (orbitRef.current) {
                orbitRef.current.enabled = !event.value
            }
        }
        controls.addEventListener('dragging-changed', onDraggingChanged)
        return () => {
            editorStateProxy.transformActive = false
            if (orbitRef.current) {
                orbitRef.current.enabled = true
            }
            controls.removeEventListener('dragging-changed', onDraggingChanged)
        }
    }, [orbitRef, controls])

    useEffect(() => {

        if (!active) return
        if (!ref.current) return
        const controls = new TransformControls(camera, gl.domElement)
        const {translationSnap} = options
        if (translationSnap != undefined) {
            controls.setTranslationSnap(translationSnap)
        }
        controls.raycaster.layers.enable(31)
        recursiveSetLayer(controls)
        setControls(controls)
        controls.attach(ref.current as Object3D)
        controls.addEventListener('mouseUp', () => {

            if (!ref.current) return

            const previousPosition = getStateValue(CUSTOM_CONFIG_KEYS.position)

            const [
                prevX,
                prevY,
                prevZ,
            ] = (previousPosition ?? [0, 0, 0])

            const {x, y, z} = ref.current.position

            if (prevX != undefined && prevX !== x || prevY != undefined && prevY !== y || prevZ != undefined && prevY !== z) {
                updateComponentModifiedState(uid, CUSTOM_CONFIG_KEYS.position, [x, y, z])
            }

        })
        scene.add(controls)

        return () => {
            controls.detach()
            scene.remove(controls)
            setControls(null)
        }

    }, [active])

    return [ref]
}