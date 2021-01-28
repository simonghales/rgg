import {MutableRefObject, useContext, useEffect} from "react";
import {Group} from "three";
import {EditableContext} from "./components/Editable";

export const useEditableWidget = (groupRef: MutableRefObject<Group | undefined>) => {

    const {setEditableWidgetGroupRefFn} = useContext(EditableContext)

    useEffect(() => {
        setEditableWidgetGroupRefFn(groupRef)
    }, [setEditableWidgetGroupRefFn])

}