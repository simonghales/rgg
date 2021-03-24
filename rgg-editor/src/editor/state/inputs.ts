import {proxy} from "valtio";
import {copySelectedComponents, handlePaste} from "./main/actions";

export const inputsProxy = proxy({
    shift: false,
    command: false,
})

export const isShiftPressed = () => {
    return inputsProxy.shift
}

export const isCommandPressed = () => {
    return inputsProxy.command
}

export const setShiftPressed = (pressed: boolean) => {
    inputsProxy.shift = pressed
}

export const setCommandPressed = (pressed: boolean) => {
    inputsProxy.command = pressed
}

export const hotkeysHandlers = {
    SHIFT_DOWN: () => {
        setShiftPressed(true)
    },
    SHIFT_UP: () => {
        setShiftPressed(false)
    },
    COMMAND_DOWN: () => {
        setCommandPressed(true)
    },
    COMMAND_UP: () => {
        setCommandPressed(false)
    },
    COPY: () => {
        copySelectedComponents()
    },
    PASTE: () => {
        handlePaste()
    }
}

export const keyMap = {
    COPY: ["command+c", "ctrl+c"],
    PASTE: ["command+v", "ctrl+v"],
    SHIFT_DOWN: {
        name: "Shift Down",
        sequence: "shift",
        action: 'keydown',
    },
    SHIFT_UP: {
        name: "Shift Up",
        sequence: "shift",
        action: 'keyup',
    },
    COMMAND_DOWN: {
        name: "Command Down",
        sequence: "command",
        action: 'keydown',
    },
    COMMAND_UP: {
        name: "Command Up",
        sequence: "command",
        action: 'keyup',
    }
};