import React from "react"
import {useShortcut} from "./shortcuts";
import {handlePaste} from "./state/main/actions";

export const GlobalHotkeysListener: React.FC = () => {

    useShortcut([{
        shortcut: 'CmdOrCtrl+Z',
        handler: () => {
            // undoState()
        }
    }, {
        shortcut: 'CmdOrCtrl+Shift+Z',
        handler: () => {
            // redoState()
        }
    }, {
        shortcut: 'CmdOrCtrl+S',
        handler: (event: any) => {
            event.preventDefault()
            // saveChanges()
        }
    }, {
        shortcut: 'CmdOrCtrl+V',
        handler: () => {
            handlePaste()
        }
    }])

    return null
}