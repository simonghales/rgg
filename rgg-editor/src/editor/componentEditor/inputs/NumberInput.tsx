import React, {useEffect, useMemo, useState} from "react"
import {styled} from "../../ui/sitches.config";
import {InputProps, StyledInput} from "./TextInput";
import {parseNumber} from "../../../utils/math";

const StyledContainer = styled('div', {})

export const NumberInput: React.FC<InputProps> = ({inputId, value, onChange: passedOnChange}) => {

    const [inputValue, setInputValue] = useState(value ?? 0)

    useEffect(() => {
        setInputValue(value ?? 0)
    }, [value])

    const {
        onChange,
    } = useMemo(() => ({
        onChange: (event: any) => {
            const newValue = parseNumber(event.target.value)
            setInputValue(newValue)
            passedOnChange(newValue)
        },
    }), [passedOnChange])

    return (
        <StyledContainer>
            <StyledInput id={inputId} type="number" value={inputValue} onChange={onChange}/>
        </StyledContainer>
    )
}