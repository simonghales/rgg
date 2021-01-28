import * as React from 'react'
import { Object3D, Group } from 'three'
import { ReactThreeFiber, useThree, Overwrite } from 'react-three-fiber'
import { TransformControls as TransformControlsImpl } from 'three/examples/jsm/controls/TransformControls'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import useEffectfulState from "../utils/drei";
import {MutableRefObject, useEffect} from "react";

export type TransformControls = Overwrite<
    ReactThreeFiber.Object3DNode<TransformControlsImpl, typeof TransformControlsImpl>,
    { target?: ReactThreeFiber.Vector3 }
    >

declare global {
    namespace JSX {
        interface IntrinsicElements {
            transformControlsImpl: TransformControls
        }
    }
}

type Props = JSX.IntrinsicElements['group'] & {
    enabled: boolean
    axis: string | null
    mode: string
    translationSnap: number | null
    rotationSnap: number | null
    scaleSnap?: number | null
    space: string
    size: number
    dragging: boolean
    showX: boolean
    showY: boolean
    showZ: boolean
}

export const TransformControls = React.forwardRef(
    ({ children, groupRef, onMouseUp, ...props }: { children: React.ReactElement<Object3D> } & {
        onMouseUp?: (group: Group) => void,
        groupRef: MutableRefObject<Group | undefined>,
    } & TransformControls, ref) => {
        const transformOnlyPropNames = [
            'enabled',
            'axis',
            'mode',
            'translationSnap',
            'rotationSnap',
            'scaleSnap',
            'space',
            'size',
            'dragging',
            'showX',
            'showY',
            'showZ',
        ]
        const transformProps = pick(props, transformOnlyPropNames)
        const objectProps = omit(props, transformOnlyPropNames)

        const { camera, gl, invalidate } = useThree()
        const controls = useEffectfulState(
            () => new TransformControlsImpl(camera, gl.domElement),
            [camera, gl.domElement],
            ref as any
        )

        const group = groupRef
        React.useLayoutEffect(() => void controls?.attach(group.current as Object3D), [children, controls])

        React.useEffect(() => {
            controls?.addEventListener?.('change', invalidate)
            return () => controls?.removeEventListener?.('change', invalidate)
        }, [controls, invalidate])

        useEffect(() => {
            const mouseUp = (event: any) => {
                if (onMouseUp && group.current) {
                    onMouseUp(group.current)
                }
            }
            controls?.addEventListener?.('mouseUp', mouseUp)
            return () => controls?.removeEventListener?.('mouseUp', mouseUp)
        }, [controls, onMouseUp])

        useEffect(() => {
            console.log('mounted')
            return () => {
                console.log('unmounted')
            }
        }, [])

        return controls ? (
            <>
                <primitive dispose={undefined} object={controls} {...transformProps} />
                {children}
            </>
        ) : null
    }
)