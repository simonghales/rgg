import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components";
import {useShortcut} from "../hotkeys/shortcuts";
import {cssClickableFont} from "./Component";
import {cssResetButton} from "../../ui/buttons";

const StyledContainer = styled.form`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const StyledInput = styled.input`
  ${cssResetButton};
  ${cssClickableFont};
  display: block;
  width: 100%;
  height: 100%;
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 12px 12px;
`

const ComponentEditName: React.FC<{
    name: string,
    updateName: (name: string) => void,
    close: () => void,
}> = ({name: initialName, updateName, close}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(initialName)
    const onSubmit = () => {
        updateName(name)
        close()
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    useShortcut([{
        shortcut: 'Esc',
        handler: () => {
            close()
        },
    },])

    return (
        <StyledContainer onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
        }}>
            <StyledInput ref={inputRef}
                   type="text"
                   value={name}
                   onChange={event => setName(event.target.value)}
                   onBlur={onSubmit}
                   maxLength={64}/>
        </StyledContainer>
    )
}

export default ComponentEditName