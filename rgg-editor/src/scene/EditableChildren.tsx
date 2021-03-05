import React from "react"
import {useEditableProp} from "./useEditableProp";
import {predefinedPropKeys} from "../editor/componentEditor/config";
import {TemporaryComponentsList} from "./TemporaryComponents";

export const EditableChildren: React.FC = ({children}) => {

    const storedChildren = useEditableProp(predefinedPropKeys.children, {
        defaultValue: [],
        hidden: true,
    }) ?? []

    return (
        <>
            {children}
            {
                storedChildren && (
                    <TemporaryComponentsList ids={storedChildren}/>
                )
            }
        </>
    )
}