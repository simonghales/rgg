import {useEffect, useRef, useState} from "react";
import {useEditableContext} from "../editable/context";
import {updateComponentModifiedState, useIsSelectedComponent} from "../state/componentsState";
import {useThree} from "react-three-fiber";
import { TransformControls as OriginalTransformControls } from "three/examples/jsm/controls/TransformControls";
// @ts-ignore
import { TransformControls as CustomTransformControls } from "../custom/TransformControls"
import {Object3D} from "three";
import {editorStateProxy, useIsCanvasInteractable, useIsEditMode, useOrbitRef} from "../state/editor";

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
} = {}) => {
    const { camera, gl, scene } = useThree()
    const {uid, getStateValue} = useEditableContext()
    const isEditMode = useIsEditMode()
    const isSelected = useIsSelectedComponent(uid)
    const ref = useRef<Object3D>()
    const orbitRef = useOrbitRef()
    const [controls, setControls] = useState<OriginalTransformControls | null>(null)
    const isCanvasEnabled = useIsCanvasInteractable()

    const active = isEditMode && isSelected && isCanvasEnabled

    useEffect(() => {
        if (!orbitRef || !controls) return
        const onDraggingChanged = (event: any) => {
            console.log('change', event.value)
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

            const previousPosition = getStateValue('position')

            const {
                x: prevX,
                y: prevY,
                z: prevZ,
            } = (previousPosition ?? {})

            const {x, y, z} = ref.current.position

            if (prevX != undefined && prevX !== x || prevY != undefined && prevY !== y || prevZ != undefined && prevY !== z) {
                updateComponentModifiedState(uid, 'position', {
                    x,
                    y,
                    z
                })
            }

        })
        scene.add(controls)

        return () => {
            setControls(null)
            controls.detach()
            scene.remove(controls)
        }

    }, [active])

    return [ref]
}