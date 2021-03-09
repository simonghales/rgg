import React, {MutableRefObject, useEffect, useMemo, useRef, useState} from "react"
import {useEditableProp} from "./useEditableProp";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {setComponentHovered} from "../editor/state/ui";
import {useEditableContext, useEditableId, useEditableIsSoleSelected, useIsEditableSelected} from "./Editable";
import {setSelectedComponents} from "../editor/state/main/actions";
import {BoxHelper, Object3D} from "three";
import {useHelper} from "@react-three/drei";
import {isCommandPressed, isShiftPressed} from "../editor/hotkeys";
import {useDraggableMesh} from "./useDraggableMesh";
import {editorStateProxy, useGroupPortalRef, useIsEditMode} from "../editor/state/editor";
import {ref} from "valtio";

export const EDITOR_LAYER = 31

export const useMeshHelper = (ref: MutableRefObject<Object3D>, active: boolean) => {
    const helperToUse = useMemo(() => {
        if (active) {
            return BoxHelper
        }
        return null
    }, [active])


    const helperRef = useHelper(ref, helperToUse)

    useEffect(() => {
        if (helperRef.current) {
            helperRef.current?.layers.set(EDITOR_LAYER)
        }
    })
}

export const InteractiveMesh: React.FC = ({children}) => {
    const id = useEditableId()
    const isSelected = useIsEditableSelected()
    const isSoleSelected = useEditableIsSoleSelected()
    const isMultipleSelected = isSelected && !isSoleSelected
    const groupPortalRef = useGroupPortalRef()
    const {setSharedProp} = useEditableContext()

    useEffect(() => {
        if (!isMultipleSelected || !groupPortalRef) return
        const parent = groupRef.current.parent
        parent?.remove(groupRef.current)
        groupPortalRef.current.add(groupRef.current)
        return () => {
            groupPortalRef.current.remove(groupRef.current)
            parent?.add(groupRef.current)
        }
    }, [isMultipleSelected, groupPortalRef])

    const position = useEditableProp(predefinedPropKeys.position, {
        defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        }
    })
    const rotation = useEditableProp(predefinedPropKeys.rotation, {
        defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        }
    })
    const scale = useEditableProp(predefinedPropKeys.scale, {
        defaultValue: {
            x: 1,
            y: 1,
            z: 1,
        }
    })

    const [pointerOver, setPointerOver] = useState(false)

    useEffect(() => {
        if (pointerOver) {
            return setComponentHovered(id)
        }
        return
    }, [pointerOver, id])

    const {
        onPointerOver,
        onPointerOut,
    } = useMemo(() => ({
        onPointerOver: (event: any) => {
            event.stopPropagation()
            if (editorStateProxy.transformActive) return
            setPointerOver(true)
        },
        onPointerOut: (event: any) => {
            event.stopPropagation()
            setPointerOver(false)
        },
    }), [])

    const groupRef = useRef<Object3D>(null!)

    useMeshHelper(groupRef, isSelected || pointerOver)
    useDraggableMesh(id, isSoleSelected, {
        passedRef: groupRef,
    })

    useEffect(() => {
        if (isSoleSelected) {
            const storedRef = ref(groupRef)
            editorStateProxy.selectedRef = storedRef
            return () =>{
                if (editorStateProxy.selectedRef === storedRef) {
                    editorStateProxy.selectedRef = null
                }
            }
        }
        return
    }, [isSoleSelected])

    useEffect(() => {
        setSharedProp('meshRef', groupRef)
    }, [setSharedProp, groupRef])

    const isEditMode = useIsEditMode()

    const content = (
        <group ref={groupRef}
               position={[position.x, position.y, position.z]}
               rotation={[rotation.x, rotation.y, rotation.z]}
               scale={[scale.x, scale.y, scale.z]}
               onPointerUp={(event) => {
                   event.stopPropagation()
                   const add = isShiftPressed() || isCommandPressed()
                   if (editorStateProxy.transformActive) return
                   setSelectedComponents({
                       [id]: true,
                   }, !add)
               }}
               onPointerOver={onPointerOver}
               onPointerOut={onPointerOut} key={isEditMode ? "edit" : "play"}>
            {children}
        </group>
    )

    return content
}