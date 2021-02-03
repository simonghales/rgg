import React, {ReactElement} from "react"
import {useGrabbableMesh} from "../three/useGrabbableMesh";
import EditableTransform from "./EditableTransform";
import {useEditableContext} from "./context";
import {useIsSelectedComponent} from "../state/componentsState";
import {useIsEditMode} from "../state/editor";

const EditableGrabbable: React.FC = ({children}) => {

    const props = useGrabbableMesh()
    const {uid} = useEditableContext()
    const isSelected = useIsSelectedComponent(uid)
    const isEditMode = useIsEditMode()

    if (!isEditMode) return children as ReactElement

    return (
        <>
            {
                isSelected && (
                    <EditableTransform/>
                )
            }
            <group {...props}>
                {
                    children
                }
            </group>
        </>
    )
}

export default EditableGrabbable