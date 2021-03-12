import {useEditableContext, useEditableIsSoleSelected, useEditableSharedProp} from "./Editable";
import {useCallback, useLayoutEffect, useMemo, useState} from "react";
import {useComponentInitialProps} from "../editor/state/components/hooks";
import {Prop, PropOrigin, setComponentProps} from "../editor/state/props";
import {useComponentState, useSharedComponent} from "../editor/state/main/hooks";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {setComponentCanHaveChildren} from "../editor/state/components/store";

interface Config {
    id?: string,
    defaultValue?: any,
    hidden?: boolean,
    sync?: boolean,
}

const useProp = (key: string, componentId: string, componentTypeId: string, defaultValue: any, hidden: boolean): Prop => {
    const initialProps = useComponentInitialProps(componentId)
    const {modifiedState = {}, overriddenState = {}} = useComponentState(componentId)
    const {appliedState = {}} = useSharedComponent(componentTypeId)

    return useMemo(() => {
        const applied = appliedState[key]
        const appliedValue = applied?.value

        const defaultResult = {
            hidden,
        }

        const appliedResult = {
            ...defaultResult,
            value: appliedValue,
            type: PropOrigin.applied,
        }

        if (modifiedState[key] && !overriddenState[key]) {
            const modifiedValue = modifiedState[key].value
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
        if (initialProps[key] && !overriddenState[key]) {
            const initialValue = initialProps[key]
            if (initialValue !== appliedValue) {
                return {
                    ...defaultResult,
                    value: initialProps[key],
                    type: PropOrigin.initial,
                }
            } else {
                return appliedResult
            }
        }
        if (applied) {
            return appliedResult
        }
        return {
            ...defaultResult,
            value: defaultValue,
            type: PropOrigin.default,
        }
    }, [initialProps, modifiedState, overriddenState, appliedState, defaultValue])
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