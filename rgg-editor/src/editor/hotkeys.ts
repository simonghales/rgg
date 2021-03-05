import {useEffect} from "react";
import hotkeys from "hotkeys-js";

export const KEYS = {
    Delete: 8,
}

export const useHotkeysListener = () => {
    useEffect(() => {
        hotkeys('*', () => {})
    }, [])
}

export const isCommandPressed = () => {
    return hotkeys.command || hotkeys.cmd || hotkeys.control
}

export const isShiftPressed = () => {
    return hotkeys.shift
}

export const isDeletePressed = () => {
    return hotkeys.isPressed(KEYS.Delete)
}