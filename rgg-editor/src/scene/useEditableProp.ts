import {useEditableContext, useEditableIsSoleSelected, useEditableSharedProp} from "./Editable";
import {useLayoutEffect, useMemo, useState} from "react";
import {useComponentInitialProp} from "../editor/state/components/hooks";
import {Prop, PropOrigin, setComponentProps} from "../editor/state/props";
import {
    useComponentModifiedStateProp,
    useComponentOverriddenStateProp,
    useSharedComponentAppliedStateProp
} from "../editor/state/immer/hooks";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {setComponentCanHaveChildren} from "../editor/state/components/store";

interface Config {
    id?: string,
    defaultValue?: any,
    hidden?: boolean,
    sync?: boolean,
}

const useProp = (key: string, componentId: string, componentTypeId: string, defaultValue: any, hidden: boolean): Prop => {
    const initialProp = useComponentInitialProp(componentId, key)
    const modifiedProp = useComponentModifiedStateProp(componentId, key)
    const overiddenProp = useComponentOverriddenStateProp(componentId, key)
    const appliedProp = useSharedComponentAppliedStateProp(componentTypeId, key)

    return useMemo(() => {
        const appliedValue = appliedProp?.value

        const defaultResult = {
            hidden,
        }

        const appliedResult = {
            ...defaultResult,
            value: appliedValue,
            type: PropOrigin.applied,
        }

        if (modifiedProp != undefined && !overiddenProp) {
            const modifiedValue = modifiedProp.value
            if (modifiedValue !== appliedValue) {
                return {
                    ...defaultResult,
                    value: modifiedValue,
                    type: PropOrigin.modified,
                }
            } else {
                return appliedResult
            }
        }
        if (initialProp != undefined && !overiddenProp) {
            if (initialProp !== appliedValue) {
                return {
                    ...defaultResult,
                    value: initialProp,
                    type: PropOrigin.initial,
                }
            } else {
                return appliedResult
            }
        }
        if (appliedValue) {
            return appliedResult
        }
        return {
            ...defaultResult,
            value: defaultValue,
            type: PropOrigin.default,
        }
    }, [initialProp, modifiedProp, overiddenProp, appliedProp, defaultValue])
}

export const useEditableProp = (key: string, config: Config = {}) => {
    const {
        id: editableId,
        componentTypeId,
        setSharedProp
    } = useEditableContext()
    const {hidden = false} = config
    const isSelected = useEditableIsSoleSelected()
    const [id] = useState(() => config.id ? config.id : editableId)
    const {sync = false} = config

    const sharedProp = useEditableSharedProp(key)

    const prop = useProp(key, id, componentTypeId, config.defaultValue, hidden)

    useLayoutEffect(() => {
        if (key === predefinedPropKeys.children) {
            return setComponentCanHaveChildren(id)
        }
        return
    }, [])

    useLayoutEffect(() => {
        if (!isSelected) return
        setComponentProps(editableId, (state) => {
            return {
                ...state,
                [key]: prop,
            }
        })
    }, [isSelected, prop])

    const {value} = prop

    useLayoutEffect(() => {
        if (!sync) return
        setSharedProp(key, value)
    }, [sync])

    return (!sync && sharedProp) ? sharedProp : prop.value
}
