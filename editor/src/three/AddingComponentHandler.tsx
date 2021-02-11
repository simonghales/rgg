import React, {useEffect, useMemo, useRef} from "react"
import {Circle} from "@react-three/drei";
import {Object3D} from "three";
import {subscribe} from "valtio";
import {editorStateProxy, useAddComponentKey} from "../state/editor";
import {useCreatable} from "../state/creatables";
import {useHotkeys} from "../inputs/hooks";
import {closeAddingComponent} from "../state/main/actions";

const AddingComponentHandler: React.FC = () => {

    const visualRef = useRef<Object3D>(null as unknown as Object3D)
    const addComponentKey = useAddComponentKey()

    useHotkeys('esc', closeAddingComponent)

    useEffect(() => {

        const apply = () => {
            if (!visualRef.current) return
            visualRef.current.position.x = editorStateProxy.addComponentPosition.x
            visualRef.current.position.y = editorStateProxy.addComponentPosition.y
        }

        apply()

        subscribe(editorStateProxy.addComponentPosition, () => {
            apply()
        })

    }, [])

    const creatable = useCreatable(addComponentKey)

    const component = useMemo(() => {
        if (!creatable) {
            return null
        }
        return creatable.create()
    }, [creatable])

    return (
        <group ref={visualRef}>
            <Circle layers={[31]}>
                <meshBasicMaterial color="white" transparent opacity={0.25} />
            </Circle>
            {component}
        </group>
    )
}

export default AddingComponentHandler