import React from "react"
import {useEditableProp} from "../useEditableProp";
import {predefinedPropKeys} from "../../editor/componentEditor/config";
import {EditableChildren} from "../EditableChildren";

export const EmptyObject: React.FC = () => {

    const rotation = useEditableProp(predefinedPropKeys.rotation)
    const scale = useEditableProp(predefinedPropKeys.scale)
    const position = useEditableProp(predefinedPropKeys.position)

    return (
        <>
            <EditableChildren/>
        </>
    )
}