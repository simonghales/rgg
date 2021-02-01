import React, {MutableRefObject, useEffect, useRef} from "react"
import {useFrame, useThree} from "react-three-fiber";
import {useIsEditMode} from "../state/global";
import {Group, Object3D, PerspectiveCamera} from "three";
import {useStoredMesh} from "react-three-game-engine";

const useFollow = (ref: MutableRefObject<Object3D | undefined>, cameraRef: MutableRefObject<PerspectiveCamera>) => {

    const playerObject = useStoredMesh('player')

    useFrame(() => {
        if (!playerObject || !ref.current) return
        ref.current.position.x = playerObject.position.x
        ref.current.position.y = playerObject.position.y
        cameraRef.current.lookAt(playerObject.position.x, playerObject.position.y,playerObject.position.z)
    })

}

const PlayCamera: React.FC = () => {

    const groupRef = useRef<Group>()
    const cameraRef = useRef<PerspectiveCamera>(null as unknown as PerspectiveCamera)
    const {setDefaultCamera} = useThree()
    const isEditMode = useIsEditMode()
    useFollow(groupRef, cameraRef)

    useEffect(() => {
        cameraRef.current.up.set(0,0,1);
        cameraRef.current.lookAt(0, 0, 1)
    }, [])

    useEffect(() => {
        if (!isEditMode) {
            setDefaultCamera(cameraRef.current)
        }
    }, [isEditMode])

    return (
        <group ref={groupRef}>
            <perspectiveCamera ref={cameraRef} position={[15, -15, 20]}/>
        </group>
    )
}

export default PlayCamera