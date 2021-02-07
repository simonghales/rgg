import React, {useCallback, useMemo, useRef} from "react"
import {Plane} from "@react-three/drei";
import {editorMutableState, editorStateProxy, useAddComponentKey, useIsAddingComponentToCanvas} from "../state/editor";
import {addNewUnsavedComponent, setSelectedComponent} from "../state/componentsState";
import {getCreatable, useCreatable} from "../state/creatables";

const EditFloor: React.FC = () => {

    const localStateRef = useRef({
        lastDown: 0,
    })
    const isAddingComponent = useIsAddingComponentToCanvas()
    const addComponentKey = useAddComponentKey()
    const creatable = useCreatable(addComponentKey)

    const transformPosition = useCallback((position: [number, number, number]) => {

        if (creatable && creatable.options && creatable.options.transformPlace) {
            return creatable.options.transformPlace(position)
        }

        return position
    }, [creatable])

    const handlers = useMemo(() => {
        return {
            onPointerOver: (event: any) => {
                if (!isAddingComponent) return
                const {x, y, z} = event.point
                const position = transformPosition([x, y, z])
                editorStateProxy.addComponentPosition.x = position[0]
                editorStateProxy.addComponentPosition.y = position[1]
            },
            onPointerMove: (event: any) => {
                if (!isAddingComponent) return
                const {x, y, z} = event.point
                const position = transformPosition([x, y, z])
                editorStateProxy.addComponentPosition.x = position[0]
                editorStateProxy.addComponentPosition.y = position[1]
                if (isAddingComponent) {
                    editorMutableState.pendingAddingComponent = false
                }
            },
            onPointerDown: () => {
                localStateRef.current.lastDown = Date.now()
                if (isAddingComponent) {
                    editorMutableState.pendingAddingComponent = true
                }
            },
            onPointerUp: (event: any) => {
                const difference = Date.now() - localStateRef.current.lastDown
                localStateRef.current.lastDown = 0
                if (difference < 200 || editorMutableState.pendingAddingComponent) {
                    const component = getCreatable(editorStateProxy.addComponentKey)
                    if (component) {
                        const {x, y, z} = event.point
                        const position = transformPosition([x, y, z])
                        const addedComponent = addNewUnsavedComponent(component, {
                            position: {
                                x: position[0],
                                y: position[1],
                                z: 0,
                            }
                        })
                        setSelectedComponent(addedComponent.uid)
                    }
                }
                editorMutableState.pendingAddingComponent = false
            },
        }
    }, [isAddingComponent, transformPosition])

    return (
        <>
            {
                isAddingComponent && (
                    <Plane args={[1000, 1000]} visible={false} {...handlers}/>
                )
            }
            <gridHelper position={[0, 0, -0.01]} args={[1000, 1000, '#888', '#111']} rotation={[Math.PI / 2, 0, 0]} layers={[31]}/>
        </>
    )
}

export default EditFloor