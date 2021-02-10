import React from "react"
import {
    getSelectedComponents,
    redoState,
    saveChanges,
    undoState,
    useAreComponentsSelected
} from "../../state/components/componentsState";
import {useShortcut} from "./shortcuts";
import {deleteSelectedComponents} from "../../state/components/temp";
import {addToClipboard, handlePaste, PendingPasteType} from "./state";

const SelectedComponentsHandler: React.FC = () => {

    useShortcut([{
        shortcut: 'Backspace',
        handler: () => {
            deleteSelectedComponents()
        }
    }{
        shortcut: 'Delete',
        handler: () => {
            deleteSelectedComponents()
        }
    }, {
        shortcut: 'CmdOrCtrl+C',
        handler: () => {
            addToClipboard({
                type: PendingPasteType.COMPONENTS,
                data: getSelectedComponents(),
            })
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
    }, {
        shortcut: 'CmdOrCtrl+V',
        handler: () => {
            handlePaste()
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