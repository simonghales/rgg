import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editable, Editor, useEditableProp} from "../../src";

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
    return (
        <div>
            TEST: {testValue}
            <Editable id="child">
                <Child/>
            </Editable>
        </div>
    )
}

const App = () => {
  return (
    <div>
        <Editor>
            <p>
                SCENE GOES HERE......
            </p>
            <Editable id="test">
                <Test/>
            </Editable>
            <Editable id="test2">
                <Test/>
            </Editable>
            <Editable id="test3" test="manual value...">
                <Child/>
            </Editable>
        </Editor>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
