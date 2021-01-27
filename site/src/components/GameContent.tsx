import React from "react"
import { a, useSpring } from '@react-spring/three'
import Editable, {useProp} from "./Editable";
import {Box} from "@react-three/drei";
import {registerComponent} from "../state/editor";

const Child: React.FC<{
    scale: number,
}> = ({children, scale}) => {

    const xProp = useProp('x', 0)
    const yProp = useProp('y', 0)
    const zProp = useProp('z', 0)

    const {x, y, z} = useSpring({
        x: Number(xProp),
        y: Number(yProp),
        z: Number(zProp),
    })

    return (
        <a.group position-x={x} position-y={y} position-z={z} scale={[scale, scale, scale]}>
            <group>
                <Box>
                    <meshBasicMaterial color={"red"} />
                </Box>
                {children}
            </group>
        </a.group>
    )

}

const Parent: React.FC = () => {

    const xProp = useProp('x', 0)
    const yProp = useProp('y', 0)
    const zProp = useProp('z', 0)

    const {x, y, z} = useSpring({
        x: Number(xProp),
        y: Number(yProp),
        z: Number(zProp),
    })

    return (
        <a.group position-x={x} position-y={y} position-z={z}>
            <Box>
                <meshBasicMaterial color={"blue"} />
            </Box>
            <Editable x={0} y={0.5} z={0} __id={"c"}>
                <Child scale={0.75}>
                    <Editable y={0.5} x={0.5} z={0.25} __id={"d"}>
                        <Child scale={0.5}/>
                    </Editable>
                </Child>
            </Editable>
        </a.group>
    )
}

registerComponent({
    name: 'Parent',
    key: 'parent',
    create: () => <Parent/>
})

const GameContent: React.FC = () => {
    return (
        <>
            <Editable y={1} x={0} z={0} __id={"z"} __override={{
                Child: {
                    y: 0.5,
                    __id: 'c',
                    __props: {
                        Child: {
                            y: 2,
                            __id: 'd',
                        }
                    },
                }
            }}>
                <Parent/>
            </Editable>
            <Editable __id={"y"} __override={{
                Child: {
                    y: -0.5,
                    __id: 'c',
                    __props: {
                        Child: {
                            y: 0,
                            __id: 'd',
                        }
                    },
                }
            }}>
                <Parent/>
            </Editable>
        </>
    )
}

export default GameContent