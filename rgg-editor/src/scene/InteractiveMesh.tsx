import React, {useEffect, useMemo, useState} from "react"
import {useEditableProp} from "./useEditableProp";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {setComponentHovered} from "../editor/state/ui";
import {useEditableId, useIsEditableSelected} from "./Editable";
import {setSelectedComponents} from "../editor/state/main/actions";

export const InteractiveMesh: React.FC = ({children}) => {
    const id = useEditableId()
    const isSelected = useIsEditableSelected()
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
        onPointerOver: () => {
            setPointerOver(true)
        },
        onPointerOut: () => {
            setPointerOver(false)
        },
    }), [])

    console.log('isSelected', isSelected)

    return (
        <group position={[position.x, position.y, position.z]}
               rotation={[rotation.x, rotation.y, rotation.z]}
               scale={[scale.x, scale.y, scale.z]}
               onPointerUp={() => {
                   setSelectedComponents({
                       [id]: true,
                   })
               }}
               onPointerOver={onPointerOver}
               onPointerOut={onPointerOut}>
            {children}
        </group>
    )
}