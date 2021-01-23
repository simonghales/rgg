import React, {useCallback} from "react"
import {useEditContext} from "./EditProvider";
import {createPortal} from "react-dom";
import styled from "styled-components";
import {cssButtonReset} from "../ui/buttons";

const filteredKeys = ['_id']

const StyledContainer = styled.div`
  
  > header {
    margin-top: 8px;
    padding-bottom: 14px;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid #22222b;
    margin-bottom: 16px;
  }

  h3 {
    font-weight: 700;
    font-size: 13px;
    color: #9494b7;
    padding-left: 8px;
  }
  
  > ul > li {
    margin-top: 8px;
  }

`

const StyledInputWrapper = styled.div`
  display: block;
  
  > header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 8px;
    margin-bottom: 6px;
    
    button {
      ${cssButtonReset};
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      color: #5a5a71;
      
      &:focus {
        outline: none;
      }
      
      &:focus,
      &:hover {
        color: #9494b7;
        text-decoration: underline;
      }
      
    }
    
  }

  p {
    font-size: 13px;
    font-weight: 700;
    color: #9494b7;
  }

  input {
    background: none;
    border: 0;
    font: inherit;
    color: inherit;
    padding: 0;
    margin: 0;

    font-size: 14.5px;
    border: 1px solid #323240;
    border-radius: 3px;
    padding: 10px;
    display: block;
    width: 100%;
    color: #9494b7;

    &:focus {
      outline: none;
    }

    &:hover,
    &:focus {
      border-color: #4c4c62;
    }

  }

`

const StyledInputOptions = styled.div`
    display: flex;
  
  > button {
    
    &:not(:first-child) {
      margin-left: 4px;
    }
    
  }
  
`

const EditPanel: React.FC<{
    uid: string,
    id: string,
    name: string,
    props: {
        [key: string]: any,
    },
    updateProp: (key: string, value: any) => void,
    clearPropValue: (key: string) => void,
}> = ({uid, id, props, name, updateProp, clearPropValue}) => {

    const {portal, applyProp} = useEditContext()

    const onChange = useCallback((key: string, value: any) => {
        updateProp(key, value)
    }, [updateProp])

    const onApply = useCallback((key: string, value: any) => {
        applyProp(id, key, value)
    }, [applyProp, id])

    const onReset = useCallback((key: string) => {
        clearPropValue(key)
    }, [clearPropValue])

    if (!portal) return null

    return createPortal((
        <StyledContainer>
            <header>
                <h3>{name}</h3>
            </header>
            <ul>
                {
                    Object.entries(props).filter(([key]) => !filteredKeys.includes(key)).map(([key, value]) => (
                        <li key={key}>
                            <StyledInputWrapper>
                                <header>
                                    <p>
                                        {key}
                                    </p>
                                    <StyledInputOptions>
                                        <button onClick={() => onApply(key, value)}>apply</button>
                                        <button onClick={() => onReset(key)}>reset</button>
                                    </StyledInputOptions>
                                </header>
                                <div>
                                    <input type="number" value={value} onChange={(event) => onChange(key, event.target.value)} />
                                </div>
                            </StyledInputWrapper>
                        </li>
                    ))
                }
            </ul>
        </StyledContainer>
    ), portal)
}

export default EditPanel