import {useEffect} from "react";
import hotkeys from "hotkeys-js";

export const useHotkeys = (event: string, callback: () => void) => {

    useEffect(() => {
        hotkeys(event, {keyup: true}, callback)

        return () => {
            hotkeys.unbind(event, callback)
        }
    }, [])

}