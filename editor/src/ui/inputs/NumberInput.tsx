import React, {useEffect, useMemo, useRef, useState} from "react"
import {Number} from "leva/packages/leva/src/index"
import styled, {css} from "styled-components";
import {cssResetInput} from "../buttons";
import {SPACE_UNITS} from "../units";
import {COLORS} from "../colors";
import {generateUuid} from "../../utils/ids";

export const cssLabel = css`
  display: inline-block;
  min-width: 60px;
  min-height: 26px;
  line-height: 26px;
  font-size: 0.8rem;
  color: ${COLORS.faintPurple};
`

export const cssInput = css`
  ${cssResetInput};
  border: 1px solid ${COLORS.faintPurple};
  display: inline-grid;
  padding: 4px 6px;
`

export const cssContainer = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

export const StyledContainer = styled.div`
  
    > div {
      ${cssContainer};
    }
  
    label {
      ${cssLabel};
    }

    input {
      ${cssInput};
    }

`

const sanitizeValue = (value: any, previousValue: any) => {
    if (isNaN(value)) {
        return previousValue
    }
    return value
}

const NumberInput: React.FC<{
    label: string,
    value: number,
}> = ({label, value: passedValue}) => {

    const [id] = useState(() => generateUuid())
    const [value, setValue] = useState(passedValue)
    const [tempValue, setTempValue] = useState(value)
    const tempValueRef = useRef(tempValue)
    const valueRef = useRef(value)

    useEffect(() => {
        tempValueRef.current = tempValue
    }, [tempValue])

    useEffect(() => {
        valueRef.current = value
    }, [value])

    const {
        onChange,
        onUpdate
    } = useMemo(() => ({
            onChange: (value: any) => {
                setTempValue(value)
            },
            onUpdate: (value: any) => {
                value = typeof value === 'function' ? value(tempValueRef.current) : value
                value = sanitizeValue(value, valueRef.current)
                setValue(value)
                setTempValue(value)
            },
    }), [])

    return (
        <StyledContainer>
            <Number id={id} value={tempValue} onChange={onChange} onUpdate={onUpdate} displayValue={tempValue} label={label} settings={{
                min: 0,
                max: 100,
                step: 1,
                pad: 0,
                initialValue: value,
            }}/>
        </StyledContainer>
    )
}

export default NumberInput