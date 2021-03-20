import React, {useCallback, useEffect, useMemo, useRef} from "react"
import {TemporaryComponents} from "./TemporaryComponents";
import EditFloor from "./EditFloor";
import EditCamera from "./EditCamera";
import {setComponentPropValue, setSelectedComponents} from "../editor/state/main/actions";
import {useSelectedComponents} from "../editor/state/main/hooks";
import {editorStateProxy, useIsEditMode} from "../editor/state/editor";
import {ref} from "valtio";
import {useMeshHelper} from "./InteractiveMesh";
import {useDraggableMesh} from "./useDraggableMesh";
import {Object3D, Box3, Vector3} from "three";
import {useCallbackRef} from "../custom/hooks";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {AddingComponentPlane} from "../editor/AddingComponentPlane";
import {useAddingComponent} from "../editor/state/ui";

const useComponentsAreSelected = () => {
    const selectedComponents = useSelectedComponents()
    return Object.keys(selectedComponents).length > 0
}

export const useEditCanvasProps = () => {

    const componentsSelected = useComponentsAreSelected()
    const isEditMode = useIsEditMode()

    return useMemo(() => {
        return {
            onPointerMissed: () => {
                if (!isEditMode) return
                if (componentsSelected) {
                    setSelectedComponents({})
                }
            }
        }
    }, [componentsSelected])
}

const center = new Vector3()

const getCenterPoint = (obj: Object3D) => {
    const boundingBox = new Box3().setFromObject(obj);
    console.log('boundingBox', boundingBox)
    boundingBox.getCenter(center)
    console.log('center', center)
    return center
}

const MultipleSelectedGroup: React.FC = () => {
    const groupRef = useRef<Object3D>(null!)
    const selectedComponents = useSelectedComponents()
    const active = Object.keys(selectedComponents).length > 1
    useEffect(() => {
        editorStateProxy.groupPortalRef = ref(groupRef)
        return () => {
            editorStateProxy.groupPortalRef = null
        }
    }, [])
    useMeshHelper(groupRef as any, active)
    const dragMeshRef = useRef(new Object3D())
    const originRef = useRef(new Vector3())

    const positionDragRef = useCallback(() => {
        const centerPosition = getCenterPoint(groupRef.current as any)
        originRef.current = centerPosition
        dragMeshRef.current.position.set(centerPosition.x, centerPosition.y, centerPosition.z)
    }, [])

    useEffect(() => {
        if (!active) return
        groupRef.current.position.set(0, 0, 0)
        setTimeout(positionDragRef)
    }, [active, selectedComponents])
    const isDraggingRef = useRef(false)
    const startingPositionRef = useRef(new Vector3())

    const updateValue = useCallbackRef(() => {
        const xDifference = groupRef.current.position.x - startingPositionRef.current.x
        const yDifference = groupRef.current.position.y - startingPositionRef.current.y
        const zDifference = groupRef.current.position.z - startingPositionRef.current.z
        Object.keys(selectedComponents).forEach((componentId) => {
            setComponentPropValue(componentId, predefinedPropKeys.position, (value: any) => {
                if (!value) {
                    // todo - get proper default?
                    value = {
                        x: 0,
                        y: 0,
                        z: 0,
                    }
                }
                return {
                    x: value.x + xDifference,
                    y: value.y + yDifference,
                    z: value.z + zDifference,
                }
            })
        })
        groupRef.current.position.set(0, 0, 0)
        positionDragRef()
    }, [selectedComponents])

    useDraggableMesh('', active, {
        updateValue: (updateType) => {
            if (updateType === predefinedPropKeys.position) {
                updateValue.current()
            }
            // todo - support scale and rotate
        },
        onChange: () => {
            if (!isDraggingRef.current) return
            groupRef.current.position.x = (originRef.current.x - dragMeshRef.current.position.x) * -1
            groupRef.current.position.y = (originRef.current.y - dragMeshRef.current.position.y) * -1
            groupRef.current.position.z = (originRef.current.z - dragMeshRef.current.position.z) * -1
        },
        onDraggingChanged: (event: any) => {
            console.log('onDraggingChanged', event)
            startingPositionRef.current.copy(groupRef.current.position)
            isDraggingRef.current = event.value
        },
        passedRef: dragMeshRef,
    })
    return (
        <>
            <group ref={groupRef}/>
            <group ref={dragMeshRef}/>
        </>
    )
}

const EditTools: React.FC = () => {

    const addingComponent = useAddingComponent()

    return (
        <>
            <EditFloor/>
            <EditCamera/>
            <MultipleSelectedGroup/>
            {
                addingComponent && (
                    <AddingComponentPlane/>
                )
            }
        </>
    )
}

export const EditCanvas: React.FC = ({children}) => {
    const isEditMode = useIsEditMode()
    return (
        <>
            {children}
            {
                isEditMode && (
                    <EditTools/>
                )
            }
            <TemporaryComponents/>
        </>
    )
}

console.warn(`TODO!!! - 'apply' function is stale, when updating component prop value`)