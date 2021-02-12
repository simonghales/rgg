import * as React from 'react';
import {Editor} from 'rgg-editor';
import Game from "../game/Game";

const App = () => {
    return (
        <Editor>
            <Game/>
        </Editor>
    );
};

export default App