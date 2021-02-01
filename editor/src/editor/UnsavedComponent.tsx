import React, {useMemo} from "react"
import { Editable } from "../editable/Editable"
import {useCreatable} from "../state/creatables";

const UnsavedComponent: React.FC<{
    uid: string,
    componentType: string,
}> = ({componentType, uid}) => {

    const creatable = useCreatable(componentType)

    const component = useMemo(() => {
        if (!creatable) {
            return null
        }
        return creatable.create()
    }, [creatable])

    return (
        <Editable __config={{
            id: uid,
            type: componentType,
        }}>
            {component}
        </Editable>
    )
}

export default UnsavedComponent