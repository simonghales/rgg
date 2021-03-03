import {useCallback, useEffect, useRef} from "react";
import {updateComponentModifiedState} from "../../../state/main/actions";
import {CUSTOM_CONFIG_KEYS} from "../SubComponentsMenu";
import {useComponentId} from "../ComponentStateMenu.context";

export const useUpdateValue = (key: string) => {

    const componentId = useComponentId()

    return useCallback((value: any | ((state: any) => any)) => {
        updateComponentModifiedState(componentId, key, value)
    }, [componentId, key])

}

export const useSyncValue = (value: any, updateFunction: (value: any, state: any) => void) => {

    const updateValue = useUpdateValue(CUSTOM_CONFIG_KEYS.rigidBody3d)
    const firstMountRef = useRef(true)

    useEffect(() => {
        if (firstMountRef.current) {
            firstMountRef.current = false
            return
        }
        updateValue((state: any) => updateFunction(value, state))
    }, [value])

}