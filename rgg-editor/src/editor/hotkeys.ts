import {useEffect} from "react";
import hotkeys from "hotkeys-js";

export const KEYS = {
    Delete: 8,
    Space: 32,
}

export const useHotkeysListener = () => {
    useEffect(() => {
        hotkeys('*', () => {})
    }, [])
}

export const isCommandPressed = () => {
    return (hotkeys.command || hotkeys.cmd || hotkeys.control) ?? false
}

export const isShiftPressed = () => {
    return hotkeys.shift ?? false
}

export const isDeletePressed = () => {
    return hotkeys.isPressed(KEYS.Delete)
}

export const isSpacePressed = () => {
    return hotkeys.isPressed(KEYS.Space)
}