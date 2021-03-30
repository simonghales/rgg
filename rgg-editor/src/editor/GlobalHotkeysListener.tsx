import React, {useRef} from "react"
import {useShortcut} from "./shortcuts";
import {handlePaste} from "./state/immer/actions";
import {redoState, undoState} from "./state/history/actions";

const delay = 100

export const GlobalHotkeysListener: React.FC = () => {

    const localStateRef = useRef({
        lastUndo: 0,
        lastRedo: 0,
        lastPaste: 0,
        lastSave: 0,
    })

    useShortcut([{
        shortcut: 'CmdOrCtrl+Z',
        handler: () => {
            const now = Date.now()
            if (now > localStateRef.current.lastUndo + delay) {
                localStateRef.current.lastUndo = now
                undoState()
            }
        }
    }, {
        shortcut: 'CmdOrCtrl+Shift+Z',
        handler: () => {
            const now = Date.now()
            if (now > localStateRef.current.lastRedo + delay) {
                localStateRef.current.lastRedo = now
                redoState()
            }
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
            const now = Date.now()
            if (now > localStateRef.current.lastPaste + delay) {
                localStateRef.current.lastPaste = now
                handlePaste()
            }
        }
    }])

    return null
}
