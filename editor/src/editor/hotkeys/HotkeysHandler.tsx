import React from "react"
import {redoState, saveChanges, undoState, useAreComponentsSelected} from "../../state/components/componentsState";
import {useShortcut} from "./shortcuts";
import {deleteSelectedComponents} from "../../state/components/temp";

const SelectedComponentsHandler: React.FC = () => {

    useShortcut([{
        shortcut: 'Backspace',
        handler: () => {
            deleteSelectedComponents()
        }
    }])

    return null
}

const HotkeysHandler: React.FC = () => {

    const areComponentsSelected = useAreComponentsSelected()

    useShortcut([{
        shortcut: 'CmdOrCtrl+Z',
        handler: () => {
            undoState()
        }
    },{
        shortcut: 'CmdOrCtrl+Shift+Z',
        handler: () => {
            redoState()
        }
    },{
        shortcut: 'CmdOrCtrl+S',
        handler: (event) => {
            event.preventDefault()
            saveChanges()
        }
    }])

    return (
        <>
            {
                areComponentsSelected && (
                    <SelectedComponentsHandler/>
                )
            }
        </>
    )
}

export default HotkeysHandler