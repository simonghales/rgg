import React, {useEffect, useMemo, useRef, useState} from "react"
import {Number} from "leva/packages/leva/src/index"
import styled, {css} from "styled-components";
import {cssResetInput} from "../buttons";
import {SPACE_UNITS} from "../units";
import {COLORS} from "../colors";
import {generateUuid} from "../../utils/ids";
import {parseInt} from "lodash-es";

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
  font-size: 0.8rem;
`

export const cssContainer = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-column-gap: ${SPACE_UNITS.small}px;
  align-items: center;
`

const cssNoMinWidthLabel = css`
  min-width: 0;
`

const cssMaxInput = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
`

export const StyledContainer = styled.div<{
    noMinWidthLabel: boolean,
    verticalLayout?: boolean,
}>`
  
    > div {
      ${props => props.verticalLayout ? '' : cssContainer};
    }
  
    label {
      ${cssLabel};
      ${props => props.noMinWidthLabel ? cssNoMinWidthLabel : ''};
    }

    input {
      ${cssInput};
      ${props => props.verticalLayout ? cssMaxInput : ''};
    }

`

const sanitizeValue = (value: any, previousValue: any) => {
    value = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(value)) {
        return previousValue
    }
    return value
}

const NumberInput: React.FC<{
    noMinWidthLabel?: boolean,
    verticalLayout?: boolean,
    label: string,
    value: number,
    onChange: (value: number) => void,
}> = ({verticalLayout = false, noMinWidthLabel = false, label, value: passedValue, onChange: passedOnChange}) => {

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
                passedOnChange(value)
            },
    }), [])

    return (
        <StyledContainer verticalLayout={verticalLayout} noMinWidthLabel={noMinWidthLabel}>
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