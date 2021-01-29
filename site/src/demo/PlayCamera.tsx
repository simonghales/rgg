import React, {MutableRefObject, useEffect, useRef} from "react"
import {useFrame, useThree} from "react-three-fiber";
import {useIsEditMode} from "../state/global";
import {Group, Object3D, PerspectiveCamera} from "three";
import {useStoredMesh} from "react-three-game-engine";

const useFollow = (ref: MutableRefObject<Object3D | undefined>) => {

    const playerObject = useStoredMesh('player')

    useFrame(() => {
        if (!playerObject || !ref.current) return
        ref.current.position.x = playerObject.position.x
        ref.current.position.y = playerObject.position.y
    })

}

const PlayCamera: React.FC = () => {

    const groupRef = useRef<Group>()
    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()
    const isEditMode = useIsEditMode()
    useFollow(groupRef)

    useEffect(() => {
        if (!isEditMode) {
            setDefaultCamera(cameraRef.current)
        }
    }, [isEditMode])

    return (
        <group ref={groupRef}>
            <perspectiveCamera ref={cameraRef} position={[0, 0, 15]}/>
        </group>
    )
}

export default PlayCamera