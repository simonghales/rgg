import React from "react"
import {useUnsavedComponents} from "../state/components/components";
import UnsavedComponent from "./UnsavedComponent";

const TemporaryComponents: React.FC = () => {

    const unsavedComponents = useUnsavedComponents()

    return (
        <>
            {
                unsavedComponents.map(({uid, componentType, initialProps}) => (
                    <UnsavedComponent uid={uid} componentType={componentType as string} initialProps={initialProps} key={uid}/>
                ))
            }
        </>
    )
}

export default TemporaryComponents