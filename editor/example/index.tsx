import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { Thing, Editor } from '../.';
import {Editor, Editable, useEditableProp, registerComponent} from '../src/index';
import {useEditableProps} from "../src/editable/context";

const SmallerComponent = () => {

    const foo = useEditableProp('foo', {
        defaultValue: 'nah',
    })

    return (
        <div>
            smaller component: {foo}
        </div>
    )

}

registerComponent('smallerComponent', 'Smaller Component', () => <SmallerComponent/>)

const InnerComponent = () => {

    const foo = useEditableProp('foo', {
        defaultValue: 'nah',
    })

    return (
        <div>
            inner component: {foo}
            <Editable blah="blah" __config={{
                id: 'z',
                type: 'c',
            }}>
                <SmallerComponent/>
            </Editable>
        </div>
    )

}

const Component = () => {

    const hello = useEditableProp('hello', {
        defaultValue: 'world 2',
    })

    const x = useEditableProp('x', {
        defaultValue: 0,
    })

    return (
        <div>
            hello: {hello}
            x: {x}
            <Editable foo={"bar"} __config={{
                id: 'x',
                type: 'b',
            }}>
                <InnerComponent/>
            </Editable>
        </div>
    )
}

const App = () => {
  return (
    <Editor>
        <div>
            <Editable hello={"world"} x={0} __config={{
                id: 'abc',
                override: {
                    x: {
                        type: 'b',
                        props: {
                            foo: 'bath',
                        },
                    },
                    z: {
                        type: 'c',
                        props: {
                            foo: 'BLAH',
                        },
                    },
                }
            }}>
                <Component/>
            </Editable>
        </div>
    </Editor>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
