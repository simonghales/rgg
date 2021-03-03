import React, {useMemo} from "react"
import RigidBody from "./rigidbody/RigidBody";
import {ComponentIndividualStateData, ComponentStateData} from "../../state/main/types";

export const CUSTOM_CONFIG_KEYS = {
    customConfig: '_customConfig',
    rigidBody3d: '_rigidBody3d',
    position: '_position',
    scale: '_scale',
}

const checkIfHasRigidBody3d = (rigidBody3d: ComponentIndividualStateData) => {
    return rigidBody3d && rigidBody3d.value !== undefined
}

const SubComponentsMenu: React.FC<{
    componentState: ComponentStateData,
}> = ({componentState}) => {
    const rigidBody3d = componentState[CUSTOM_CONFIG_KEYS.rigidBody3d]
    const hasRigidBody3d = useMemo(() => {
        return checkIfHasRigidBody3d(rigidBody3d)
    }, [rigidBody3d])
    return (
        <div>
            <ul>
                {
                    hasRigidBody3d && rigidBody3d && (
                        <li>
                            <RigidBody state={rigidBody3d}/>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default SubComponentsMenu