import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor} from "../../src";

const App = () => {
  return (
    <div>
        <Editor>
            <p>
                SCENE GOES HERE......
            </p>
        </Editor>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
