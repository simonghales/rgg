import React from "react"
import { styled } from "../../ui/sitches.config";
import {InputProps} from "./TextInput";
import UnknownInput from "./UnknownInput";

const StyledContainer = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
    columnGap: '$2b',
})

const StyledItem = styled('div', {
    display: 'grid',
    alignItems: 'center',
    columnGap: '$1b',
    gridTemplateColumns: 'auto minmax(0, 1fr)'
})

const StyledLabel = styled('label', {
    fontSize: '$1b',
})

export const MultiNumberInput: React.FC<InputProps> = ({inputId, value, onChange: passedOnChange}) => {
    return (
        <StyledContainer>
            {
                Object.entries(value).map(([entryKey, entryValue], index) => {
                    const id = index === 0 ? inputId : `${inputId}/${entryKey}`
                    return (
                        <StyledItem key={entryKey}>
                            <StyledLabel htmlFor={id}>{entryKey}</StyledLabel>
                            <UnknownInput inputId={id} value={entryValue} onChange={(newValue: any) => {
                                passedOnChange({
                                    ...value,
                                    [entryKey]: newValue,
                                })
                            }}/>
                        </StyledItem>
                    )
                })
            }
        </StyledContainer>
    )
}