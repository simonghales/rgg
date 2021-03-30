import React from "react"
import {useShortcut} from "./shortcuts";
import {copySelectedComponents, deleteSelectedComponents} from "./state/immer/actions";

export const SelectedComponentListeners: React.FC = () => {

    useShortcut([
        {
            shortcut: 'Backspace',
            handler: () => {
                deleteSelectedComponents()
            }
        },
        {
            shortcut: 'Delete',
            handler: () => {
                deleteSelectedComponents()
            }
        }, {
            shortcut: 'CmdOrCtrl+C',
            handler: () => {
                copySelectedComponents()
            }
        }])

    return null
}
