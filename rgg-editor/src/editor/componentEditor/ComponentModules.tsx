import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react"
import {Prop} from "../state/props";
import {predefinedProps} from "./config";
import {setComponentPropValue} from "../state/immer/actions";
import UnknownInput from "./inputs/UnknownInput";
import {storeSnapshot} from "../state/history/actions";

const Context = createContext<{
    propType: string,
    propKey: string,
    componentId: string,
    componentTypeId: string,
}>({
    propType: '',
    propKey: '',
    componentId: '',
    componentTypeId: '',
})

export const usePropContext = () => useContext(Context)

export const Module: React.FC<{
    componentId: string,
    componentTypeId: string,
    value: any,
    propKey: string,
    propType: string,
    onChange?: (value: any) => void,
}> = ({componentId, componentTypeId, value, propKey, propType, onChange: passedOnChange}) => {

    const [inputValue, setInputValue] = useState(value)

    const updateValue = useCallback((newValue: any) => {
        storeSnapshot()
        setComponentPropValue(componentId, propKey, newValue)
        if (passedOnChange) {
            passedOnChange(newValue)
        }
    }, [componentId])

    const {
        onChange,
    } = useMemo(() => ({
        onChange: (newValue: any) => {
            setInputValue(newValue)
            updateValue(newValue)
        },
    }), [updateValue])

    useEffect(() => {
        setInputValue(value)
    }, [value])

    const propConfig = useMemo(() => {
        return predefinedProps[propKey]
    }, [propKey])

    const InputComponent = useMemo(() => {
        console.log('propConfig', propConfig)
        return propConfig?.input ?? UnknownInput
    }, [propConfig])

    const defaultValue = propConfig?.defaultValue ?? ''
    const inputId = `input-${propKey}`

    return (
        <Context.Provider value={{
            propType,
            propKey,
            componentId,
            componentTypeId,
        }}>
            <div>
                {InputComponent && <InputComponent inputId={inputId} value={inputValue ?? defaultValue} onChange={onChange}/>}
            </div>
        </Context.Provider>
    )
}

export const ComponentModules: React.FC<{
    componentId: string,
    componentTypeId: string,
    props: {
        [key: string]: Prop,
    }
}> = ({componentId, componentTypeId, props}) => {
    return (
        <div>
            {
                Object.entries(props).map(([propKey, prop]) => {
                    if (prop.value === undefined) return null
                    return (
                        <Module key={propKey} propKey={propKey} propType={prop.type} value={prop.value} componentId={componentId} componentTypeId={componentTypeId}/>
                    )
                })
            }
        </div>
    )
}
