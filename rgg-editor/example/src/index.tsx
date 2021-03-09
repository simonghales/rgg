import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Canvas} from "react-three-fiber";
import {
    Editable,
    EditCanvas,
    Editor,
    InteractiveMesh,
    predefinedPropKeys, registerAddable,
    useEditableProp,
    useEditCanvasProps, useIsEditMode
} from "../../src";
import {Box, Sphere} from '@react-three/drei';
import RGGEngine from "./RGGEngine";

const Child = () => {
    const testValue = useEditableProp('test', {
        defaultValue: 'child world!',
    })
    return (
        <div>
            CHILD: {testValue}
        </div>
    )
}

const Test = () => {
    const testValue = useEditableProp('test', {
        defaultValue: 'hello world!',
    })
    const rotation = useEditableProp(predefinedPropKeys.rotation)
    const scale = useEditableProp(predefinedPropKeys.scale)
    const position = useEditableProp(predefinedPropKeys.position)
    return (
        <div>
            TEST: {testValue}
            <Editable id="child" _config={{
                type: 'child',
            }}>
                <Child/>
            </Editable>
        </div>
    )
}

const Ball = () => {
    return (
        // <InteractiveMesh>
            <Sphere/>
        // </InteractiveMesh>
    )
}

registerAddable('ball', Ball, {
    name: 'Ball'
})

const BoxWrapper = () => {
    return (
        // <InteractiveMesh>
            <Box>
                <meshBasicMaterial color="#444" />
            </Box>
        // </InteractiveMesh>
    )
}

registerAddable('box', BoxWrapper, {
    name: 'Box'
})

const Scene = ({children}: any) => {
    const canvasProps = useEditCanvasProps()
    return (
        <Canvas {...canvasProps}>
            <RGGEngine>
                <EditCanvas>
                    {children}
                </EditCanvas>
            </RGGEngine>
        </Canvas>
    )
}

const App = () => {
  return (
    <div>
        <Editor>
            <Scene>
                <ambientLight intensity={0.5} />
                <Editable id="ball">
                    <Ball/>
                </Editable>
            </Scene>
        </Editor>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
