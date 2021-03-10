import {useCallback, useEffect, useRef} from "react";
import hotkeys from "hotkeys-js";

type Options = {
    scope?: string,
    element?: HTMLElement | null,
    keyup?: boolean | null
    keydown?: boolean | null
    splitKey?: string;
}

export const useHotkeys = (event: string, callback: any, options?: Options) => {

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

export const useCallbackRef = (cb: () => any, dependencies: any[]) => {

    const callback = useCallback(cb, dependencies)
    const callbackRef = useRef(callback)
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])
    return callbackRef

}