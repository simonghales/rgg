import hotkeys from "hotkeys-js";

const KEY_CODES: {
    [key: string]: number,
} = {
    shift: 16,
}

type Input = {
    codes: number[],
}

export const INPUTS: {
    [key: string]: {
        codes: number[],
    },
} = {
    shift: {
        codes: [KEY_CODES.shift]
    }
}

export const isInputPressed = (input: Input): boolean => {
    for (let i = 0, len = input.codes.length; i < len; i++) {
        if (hotkeys.isPressed(input.codes[i])) {
            return true
        }
    }
    return false
}