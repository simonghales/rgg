import React from "react"
import {useUnsavedComponents} from "../state/components";
import UnsavedComponent from "./UnsavedComponent";

const TemporaryComponents: React.FC = () => {

    const unsavedComponents = useUnsavedComponents()

    return (
        <>
            {
                unsavedComponents.map(({uid, componentType}) => (
                    <UnsavedComponent uid={uid} componentType={componentType as string} key={uid}/>
                ))
            }
        </>
    )
}

export default TemporaryComponents