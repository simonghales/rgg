import React from "react"
import Editable, {useProp} from "./Editable";
import {Box} from "@react-three/drei";
import {registerComponent} from "../state/editor";

const Child: React.FC<{
    scale: number,
}> = ({children, scale}) => {

    const x = useProp('x', 0)
    const y = useProp('y', 0)
    const z = useProp('z', 0)

    return (
        <group position={[x, y, z]} scale={[scale, scale, scale]}>
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

    return (
        <group position={[x, y, z]}>
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

registerComponent('Parent', () => <Parent/>)

const GameContent: React.FC = () => {
    return (
        <>
            <Editable y={1} x={0} z={0} __id={"z"} __override={{
                Child: {
                    y: 0.5,
                    __id: 'c',
                    __props: {
                        Child: {
                            y: 1,
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