import hotkeys from "hotkeys-js";

export const KEY_CODES: {
    [key: string]: number,
} = {
    delete: 8,
    shift: 16,
    escape: 27,
    command: 91,
}

type Input = {
    codes: number[],
}

export const INPUTS: {
    [key: string]: {
        codes: number[],
    },
} = {
    delete: {
        codes: [KEY_CODES.delete]
    },
    escape: {
        codes: [KEY_CODES.escape]
    },
    shift: {
        codes: [KEY_CODES.shift]
    },
    command: {
        codes: [KEY_CODES.command]
    },
}

export const isInputPressed = (input: Input): boolean => {
    for (let i = 0, len = input.codes.length; i < len; i++) {
        if (hotkeys.isPressed(input.codes[i])) {
            return true
        }
    }
    return false
}