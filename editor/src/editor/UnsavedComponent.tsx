import React, {useMemo} from "react"
import { Editable } from "../editable/Editable"
import {useCreatable} from "../state/creatables";

const UnsavedComponent: React.FC<{
    uid: string,
    componentType: string,
    initialProps?: {
        [key: string]: any,
    }
}> = ({componentType, uid, initialProps = {}}) => {

    const creatable = useCreatable(componentType)

    const component = useMemo(() => {
        if (!creatable) {
            return null
        }
        return creatable.create(initialProps)
    }, [creatable])

    return (
        <Editable {...initialProps} id={uid} __config={{
            type: componentType,
            unsaved: true,
        }}>
            {component}
        </Editable>
    )
}

export default UnsavedComponent