import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useHelper} from "@react-three/drei";
import {BoxHelper} from "three";
import {useEditableContext} from "../editable/context";
import {setComponentEditorHovered, useIsHovered} from "../state/localState";
import {editorStateProxy, useIsCanvasInteractable} from "../state/editor";
import {useProxy} from "valtio";
import {INPUTS, isInputPressed} from "../inputs/inputs";
import {useIsComponentSelected, useIsOnlyComponentSelected} from "../state/main/hooks";
import {setSelectedComponent} from "../state/main/actions";
import hotkeys from "hotkeys-js";

export const useGrabbableMesh = (passedRef?: any, helper?: any) => {
    const localRef = useRef()
    const ref = passedRef || localRef
    const {uid} = useEditableContext()
    const isHovered = useIsHovered(uid)
    const isGroupSelected = useIsComponentSelected(uid)
    const isSelected = useIsOnlyComponentSelected(uid) || (helper)
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
                if (isSelected && (isInputPressed(INPUTS.command))) {
                    setSelectedComponent(false, uid, false)
                    return
                }
                setSelectedComponent(true, uid, (!isInputPressed(INPUTS.command) && !hotkeys.shift))
            }
        }
        if (isSelected) {
            handlers.onPointerMissed = () => {
                if (editorStateProxy.transformActive) {
                    return
                }
                setSelectedComponent(false, uid, false)
            }
        }
        return handlers
    }, [isSelected, isCanvasEnabled])

    const helperToUse = useMemo(() => {
        if (active || isGroupSelected) {
            return helper ?? BoxHelper
        }
        return null
    }, [active, helper, isGroupSelected])


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