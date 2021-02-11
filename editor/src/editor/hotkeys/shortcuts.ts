import {Shortcuts} from 'shortcuts';
import {ShortcutDescriptor} from "shortcuts/src/types";
import {useEffect} from "react";

const shortcutsManager = new Shortcuts()

export const registerShortcut = (shortcuts: ShortcutDescriptor | ShortcutDescriptor[], manager?: Shortcuts) => {
    if (!manager) {
        manager = shortcutsManager
    }

    manager.add(shortcuts)

    return () => {
        manager?.remove(shortcuts)
    }
}

export const useShortcut = (shortcuts: ShortcutDescriptor | ShortcutDescriptor[], manager?: Shortcuts) => {

    useEffect(() => {
        return registerShortcut(shortcuts, manager)
    }, [])

}