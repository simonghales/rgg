import React, {ReactElement} from "react"
import {useGrabbableMesh} from "../three/useGrabbableMesh";
import EditableTransform from "./EditableTransform";
import {useEditableContext} from "./context";
import {useIsEditMode} from "../state/editor";
import {useIsOnlyComponentSelected} from "../state/main/hooks";

const EditableGrabbable: React.FC = ({children}) => {

    const props = useGrabbableMesh()
    const {uid} = useEditableContext()
    const isSelected = useIsOnlyComponentSelected(uid)
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