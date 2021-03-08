import {Plane, Sphere} from "@react-three/drei"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {DoubleSide, Object3D} from "three";
import {useFrame, useThree} from "react-three-fiber";
import {isShiftPressed} from "./hotkeys";
import {addStoredComponent} from "./state/ui";

export const AddingComponentPlane: React.FC = () => {
    const planeRef = useRef<Object3D>(null!)
    const floorRef = useRef<Object3D>(null!)
    const {camera} = useThree()
    const [horizontalMode, setHorizontalMode] = useState(true)
    const localStateRef = useRef({
        x: 0,
        z: 0,
        y: 0,
        disabled: false,
        pointerDown: false,
    })
    const localState = localStateRef.current

    useEffect(() => {
        const onMouseDown = () => {
            localState.pointerDown = true
        }
        const onMouseUp = () => {
            localState.pointerDown = false
            localState.disabled = false
        }
        const onMouseMove = () => {
            if (localState.pointerDown) {
                localState.disabled = true
            }
        }
        const onPointerDown = () => {
            onMouseDown()
        }
        const onPointerUp = () => {
            onMouseUp()
        }
        window.addEventListener('pointermove', onMouseMove)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('pointerdown', onPointerDown)
        window.addEventListener('pointerup', onPointerUp)
        return () => {
            window.removeEventListener('pointermove', onMouseMove)
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('pointerup', onPointerUp)
        }
    }, [])

    const {onFloorPointerMove, onVerticalPointerUp, onVerticalMove, onFloorPointerUp} = useMemo(() => (
        {
            onVerticalPointerUp: (event: any) => {
                if (horizontalMode) return
                if (localState.disabled) return
                event.stopPropagation()
                const {y} = event.point
                const {x, z} = localState
                addStoredComponent({
                    x,
                    y,
                    z
                })
            },
            onFloorPointerUp: (event: any) => {
                if (!horizontalMode) return
                if (localState.disabled) return
                event.stopPropagation()
                const {x, z} = event.point
                const {y} = localState
                addStoredComponent({
                    x,
                    y,
                    z
                })
            },
            onFloorPointerMove: (event: any) => {
                if (!horizontalMode) return
                if (localState.disabled) return
                event.stopPropagation()
                const {x, z} = event.point
                localState.x = x
                localState.z = z
            },
            onVerticalMove: (event: any) => {
                if (horizontalMode) return
                if (localState.disabled) return
                event.stopPropagation()
                const {y} = event.point
                localState.y = y
            },
        }
    ), [horizontalMode])

    useEffect(() => {
        planeRef.current.position.x = localState.x
        planeRef.current.position.z = localState.z
        planeRef.current.position.y = localState.y
        floorRef.current.position.x = Math.round(localState.x)
        floorRef.current.position.y = localState.y
        floorRef.current.position.z = Math.round(localState.z)
    }, [horizontalMode])

    const groupRef = useRef<Object3D>(null!)

    useFrame(() => {
        planeRef.current.rotation.y = Math.atan2( ( camera.position.x - planeRef.current.position.x ), ( camera.position.z - planeRef.current.position.z ) );
        groupRef.current.position.y = localState.y
        groupRef.current.position.x = localState.x
        groupRef.current.position.z = localState.z
    })

    useEffect(() => {
        const callback = () => {
            setHorizontalMode(!isShiftPressed())
        }
        document.addEventListener('keydown', callback)
        document.addEventListener('keyup', callback)
        return () => {
            document.removeEventListener('keydown', callback)
            document.removeEventListener('keyup', callback)
        }
    }, [])

    return (
        <>
            <Plane args={[256, 256]} onPointerMove={onFloorPointerMove} onPointerUp={onFloorPointerUp} rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
                <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
                <gridHelper rotation={[-Math.PI /2, 0, 0]} visible={horizontalMode} position={[0, 0, 0]} args={[1000, 1000, 'rgb(28,113,255, 0.05)', 'rgb(28,113,255, 0.05)']} layers={[31]}/>
            </Plane>
            <Plane args={[256, 256]} onPointerMove={onVerticalMove} onPointerUp={onVerticalPointerUp} ref={planeRef}>
                <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
                <gridHelper rotation={[-Math.PI /2, 0, 0]} visible={!horizontalMode} args={[1000, 1000, 'rgb(28,113,255, 0.05)', 'rgb(28,113,255, 0.05)']} layers={[31]}/>
            </Plane>
            <group ref={groupRef}>
                <Sphere>
                    <meshBasicMaterial color="green" />
                </Sphere>
            </group>
        </>
    )
}