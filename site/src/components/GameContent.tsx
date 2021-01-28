import React, {useEffect, useRef} from "react"
import { a, useSpring } from '@react-spring/three'
import Editable, {useProp} from "./Editable";
import {Box} from "@react-three/drei";
import {registerComponent} from "../state/editor";
import {useEditableWidget} from "../misc";
import {Group} from "three";

const Child: React.FC<{
    scale: number,
}> = ({children, scale}) => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    const groupRef = useRef<Group>()
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} scale={[scale, scale, scale]} ref={groupRef}>
            <Box>
                <meshBasicMaterial color={"red"} />
            </Box>
            {children}
        </group>
    )

}

const Parent: React.FC = () => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    const groupRef = useRef<Group>()
    useEditableWidget(groupRef)

    return (
        <group position={[x, y, z]} ref={groupRef}>
            <Box position={[0.5, 0.5, 0.5]} scale={[0.5, 0.5, 0.5]}>
                <meshBasicMaterial color={"green"} />
            </Box>
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
        </group>
    )
}

registerComponent({
    name: 'Parent',
    key: 'parent',
    create: () => <Parent/>
})

const GameContent: React.FC = () => {
    return null
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
            <Editable x={0} y={0.5} z={0} __id={"q"}>
                <Child scale={0.75}>
                    <Editable y={0.5} x={0.5} z={0.25} __id={"d"}>
                        <Child scale={0.5}/>
                    </Editable>
                </Child>
            </Editable>
        </>
    )
}

export default GameContent