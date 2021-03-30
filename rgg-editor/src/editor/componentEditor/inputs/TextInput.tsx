import React, {useEffect, useMemo, useState} from "react"
import { styled } from "../../ui/stitches.config"

export interface InputProps {
    inputId: string,
    value: any,
    onChange: (value: any) => void,
}

const StyledContainer = styled('div', {})

export const StyledInput = styled('input', {
    appearance: 'none',
    backgroundColor: '$darkGreyLighter',
    border: '1px solid $faintPurple',
    color: '$lightPurple',
    width: '100%',
    padding: '$1b',
    fontSize: '$1b',
    ':focus': {
        backgroundColor: '$darkGrey',
        color: '$white',
    }
})

export const TextInput: React.FC<InputProps> = ({inputId, value, onChange: passedOnChange}) => {

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
        <StyledContainer>
            <StyledInput id={inputId} type="text" value={inputValue} onChange={onChange}/>
        </StyledContainer>
    )
}
