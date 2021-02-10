import React from "react"
import EditCamera from "./EditCamera";
import EditFloor from "./EditFloor";
import {useIsAddingComponentToCanvas, useIsEditMode} from "../state/editor";
import AddingComponentHandler from "./AddingComponentHandler";
import HotkeysHandler from "../editor/hotkeys/HotkeysHandler";

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
                    <>
                        <HotkeysHandler/>
                        <EditFloor/>
                    </>
                )
            }
        </>
    )
}

export default EditTools