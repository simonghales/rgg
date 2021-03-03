import {useEditableId} from "./Editable";
import {useLayoutEffect, useState} from "react";
import {useComponentInitialProps} from "../editor/state/components/hooks";

interface Config {
    id?: string,
    defaultValue?: any,
}

const useProp = (key: string, componentId: string, defaultValue: any): any => {
    const initialProps = useComponentInitialProps(componentId)
    return initialProps[key] ?? defaultValue
}

export const useEditableProp = (key: string, config: Config = {}) => {
    const editableId = useEditableId()
    const [id] = useState(() => config.id ? config.id : editableId)

    useLayoutEffect(() => {
        // todo - register this prop...
    }, [])

    return useProp(key, id, config.defaultValue)
}