import React, {useMemo, useRef} from "react"
import {Plane} from "@react-three/drei";
import {editorMutableState, editorStateProxy, useIsAddingComponentToCanvas} from "../state/editor";
import {addNewUnsavedComponent, setSelectedComponent} from "../state/componentsState";
import {getCreatable} from "../state/creatables";

const EditFloor: React.FC = () => {

    const localStateRef = useRef({
        lastDown: 0,
    })
    const isAddingComponent = useIsAddingComponentToCanvas()

    const handlers = useMemo(() => {
        return {
            onPointerOver: (event: any) => {
                if (!isAddingComponent) return
                const {x, y} = event.point
                editorStateProxy.addComponentPosition.x = x
                editorStateProxy.addComponentPosition.y = y
            },
            onPointerMove: (event: any) => {
                if (!isAddingComponent) return
                const {x, y} = event.point
                editorStateProxy.addComponentPosition.x = x
                editorStateProxy.addComponentPosition.y = y
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
                        const {x, y} = event.point
                        const addedComponent = addNewUnsavedComponent(component, {
                            x,
                            y,
                        })
                        setSelectedComponent(addedComponent.uid)
                    }
                }
                editorMutableState.pendingAddingComponent = false
            },
        }
    }, [isAddingComponent])

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