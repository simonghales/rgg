import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useHelper} from "@react-three/drei";
import {BoxHelper} from "three";
import {useEditableContext} from "../editable/context";
import {setSelectedComponent, useIsSelectedComponent} from "../state/componentsState";
import {setComponentEditorHovered, useIsHovered} from "../state/localState";
import {editorStateProxy, useIsCanvasInteractable} from "../state/editor";
import {useProxy} from "valtio";

export const useGrabbableMesh = (passedRef?: any, helper?: any) => {
    const localRef = useRef()
    const ref = passedRef || localRef
    const {uid} = useEditableContext()
    const isHovered = useIsHovered(uid)
    const isSelected = useIsSelectedComponent(uid) || (helper)
    const isCanvasEnabled = useIsCanvasInteractable()
    const [hovered, setHovered] = useState(isHovered)

    useEffect(() => {
        setComponentEditorHovered(uid, hovered)
    }, [hovered])

    const active = (isHovered || isSelected) && isCanvasEnabled
    const transformActive = useProxy(editorStateProxy).transformActive

    useEffect(() => {
        if (!isCanvasEnabled) {
            setHovered(false)
        }
    }, [isCanvasEnabled])

    useEffect(() => {
        if (transformActive && !isSelected) {
            setHovered(false)
        }
    }, [transformActive, isSelected])

    useLayoutEffect(() => {

    }, [])

    const handlers = useMemo(() => {
        const handlers: any = {
            onPointerOver: (event: PointerEvent) => {
                if (!isCanvasEnabled) return
                event.stopPropagation()
                if (editorStateProxy.transformActive) return
                setHovered(true)
            },
            onPointerOut: (event: PointerEvent) => {
                setHovered(false)
                if (!isCanvasEnabled) return
                event.stopPropagation()
            },
            onPointerDown: (event: PointerEvent) => {
                if (!isCanvasEnabled) return
                if (editorStateProxy.transformActive) {
                    return
                }
                event.stopPropagation()
                setSelectedComponent(uid)
            }
        }
        if (isSelected) {
            handlers.onPointerMissed = () => {
                if (editorStateProxy.transformActive) {
                    return
                }
                setSelectedComponent('', uid)
            }
        }
        return handlers
    }, [isSelected, isCanvasEnabled])

    const helperToUse = active ? (helper ?? BoxHelper) : null

    const helperRef = useHelper(ref, helperToUse)

    useEffect(() => {
        if (helperRef.current) {
            helperRef.current?.layers.set(31)
        }
    })

    return {
        ref,
        ...handlers
    }
}