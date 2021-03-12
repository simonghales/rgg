import React from "react"
import {Cylinder} from "@react-three/drei";
import {SyncedComponent, useSyncBody} from "rgg-engine";
import {useEditableSharedProp, useIsEditMode} from "../../src";

const Physics: React.FC = () => {
    const meshRef = useEditableSharedProp('meshRef')

    useSyncBody('player', meshRef)
    return (
        <SyncedComponent id='player' type="player"/>
    )
}

const Player: React.FC = () => {

    const isEditMode = useIsEditMode()

    return (
        <>
            <Cylinder args={[0.5, 0.5, 2]} position={[0, 0, 0]}>
                <meshBasicMaterial color="blue" />
            </Cylinder>
            {
                !isEditMode && (
                    <Physics/>
                )
            }
        </>
    )
}

export default Player