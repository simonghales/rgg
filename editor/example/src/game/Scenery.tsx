import React from "react"
import {EditableGrabbable, registerComponent, useDraggableMesh, useEditableProp} from "rgg-editor";
import {Sphere} from "@react-three/drei";

const Scenery: React.FC = () => {

    const {x, y, z} = useEditableProp('position', {defaultValue: {
            x: 0,
            y: 0,
            z: 0,
        }})

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