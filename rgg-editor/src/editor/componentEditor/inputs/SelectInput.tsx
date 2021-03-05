import React, {useEffect, useMemo, useState} from "react"
import {InputProps} from "./TextInput";

export const SelectInput: React.FC<InputProps & {
    options: {
        value: string,
        label?: string,
    }[]
}> = ({inputId, value, onChange: passedOnChange, options}) => {
    const [inputValue, setInputValue] = useState(value ?? '')

    useEffect(() => {
        setInputValue(value ?? '')
    }, [value])

    const {
        onChange,
    } = useMemo(() => ({
        onChange: (event: any) => {
            const newValue = event.target.value
            setInputValue(newValue)
            passedOnChange(newValue)
        },
    }), [passedOnChange])

    return (
        <select id={inputId} value={inputValue} onChange={onChange}>
            {
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label ?? option.value}
                    </option>
                ))
            }
        </select>
    )
}