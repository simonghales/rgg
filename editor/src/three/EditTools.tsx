import React from "react"
import EditCamera from "./EditCamera";
import EditFloor from "./EditFloor";
import {useIsAddingComponentToCanvas, useIsEditMode} from "../state/editor";
import AddingComponentHandler from "./AddingComponentHandler";

const EditTools: React.FC = () => {
    const isEditMode = useIsEditMode()
    const isAddingComponent = useIsAddingComponentToCanvas()
    return (
        <>
            <EditCamera/>
            {
                isAddingComponent && (
                    <AddingComponentHandler/>
                )
            }
            {
                isEditMode && (
                    <EditFloor/>
                )
            }
        </>
    )
}

export default EditTools