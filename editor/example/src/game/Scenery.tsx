import React from "react"
import {EditableGrabbable, registerComponent, useDraggableMesh, useEditableProp} from "rgg-editor";
import {Sphere} from "@react-three/drei";

const Scenery: React.FC = () => {
    const x = useEditableProp('x', {
        defaultValue: 0,
    })

    const y = useEditableProp('y', {
        defaultValue: 0,
    })

    const z = useEditableProp('z', {
        defaultValue: 0,
    })

    const [ref] = useDraggableMesh()

    return (
        <EditableGrabbable>
            <group position={[x, y, z]} ref={ref}>
                <Sphere position={[0, 0, 1]}>
                    <meshBasicMaterial color="blue" />
                </Sphere>
            </group>
        </EditableGrabbable>
    )
}

Scenery.displayName = 'Scenery'

export default Scenery