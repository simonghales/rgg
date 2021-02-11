import {useEffect} from "react";
import hotkeys from "hotkeys-js";

type Options = {
    scope?: string,
    element?: HTMLElement | null,
    keyup?: boolean | null
    keydown?: boolean | null
    splitKey?: string;
}

export const useHotkeys = (event: string, callback: () => void, options?: Options) => {

    useEffect(() => {
        if (options) {
            hotkeys(event, options, callback)
        } else {
            hotkeys(event, callback)
        }

        return () => {
            hotkeys.unbind(event, callback)
        }
    }, [])

}