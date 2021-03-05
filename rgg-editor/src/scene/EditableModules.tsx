import React from "react"
import {useEditableProp} from "./useEditableProp";
import {modulesProp, predefinedPropKeys} from "../editor/componentEditor/config";

export const EditableModules: React.FC = ({children}) => {

    useEditableProp(modulesProp.key)
    useEditableProp(predefinedPropKeys.rigidBody3d)

    return (
        <>
            {children}
        </>
    )
}