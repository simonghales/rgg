import React, {useCallback, useState} from "react"
import {cssContainer, cssInput, cssLabel} from "./NumberInput";
import styled, {css} from "styled-components";
import {generateUuid} from "../../utils/ids";

export const cssSelect = css`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
`

export const StyledSelect = styled.select`
  ${cssSelect};
  ${cssInput};
  
  option {
    color: black;
  }
  
`

const StyledContainer = styled.div`
  ${cssContainer};

  label {
    ${cssLabel};
  }

`

export type SelectInputOption = {
    value: string,
    label?: string,
}

const SelectInput: React.FC<{
    value: string,
    label: string,
    options: SelectInputOption[],
    onChange: (value: string) => void,
}> = ({value, label, options, onChange: passedOnChange}) => {

    const [id] = useState(() => generateUuid())

    const onChange = useCallback((event: any) => {
        passedOnChange(event.target.value)
    }, [passedOnChange])

    return (
        <StyledContainer>
            <div>
                <label htmlFor={id}>
                    {label}
                </label>
            </div>
            <StyledSelect value={value} id={id} onChange={onChange}>
                {
                    options.map(({value, label}) => (
                        <option value={value} key={value}>{label || value}</option>
                    ))
                }
            </StyledSelect>
        </StyledContainer>
    )
}

export default SelectInput