import React, {useState} from "react"
import {InputProps, TextInput} from "./TextInput";
import {NumberInput} from "./NumberInput";

const inputComponents = {
    text: {
        input: TextInput,
    },
    number: {
        input: NumberInput,
    }
}

const UnknownInput: React.FC<InputProps> = (props) => {
    const [InputComponent] = useState(() => {
        const {value} = props
        if (typeof value === 'number') {
            return inputComponents.number.input
        }
        return inputComponents.text.input
    })
    return <InputComponent {...props}/>
}

export default UnknownInput