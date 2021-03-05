import React, {useMemo} from "react"
import {TemporaryComponents} from "./TemporaryComponents";
import EditFloor from "./EditFloor";
import EditCamera from "./EditCamera";
import {setSelectedComponents} from "../editor/state/main/actions";
import {useSelectedComponents} from "../editor/state/main/hooks";

const useComponentsAreSelected = () => {
    const selectedComponents = useSelectedComponents()
    return Object.keys(selectedComponents).length > 0
}

export const useEditCanvasProps = () => {

    const componentsSelected = useComponentsAreSelected()

    return useMemo(() => {
        return {
            onPointerMissed: () => {
                if (componentsSelected) {
                    setSelectedComponents({})
                }
            }
        }
    }, [componentsSelected])
}

const EditTools: React.FC = () => {
    return (
        <>
            <EditFloor/>
            <EditCamera/>
        </>
    )
}

export const EditCanvas: React.FC = ({children}) => {
    return (
        <>
            {children}
            <EditTools/>
            <TemporaryComponents/>
        </>
    )
}