import React, {useMemo} from "react"
import {useTempComponents} from "../state/tempComponents";
import {useRegisteredComponents} from "../state/editor";
import Editable from "./Editable";

const SceneTempComponents: React.FC = () => {
    const tempComponents = useTempComponents()
    const registeredComponents = useRegisteredComponents()
    const renderedComponents = useMemo(() => {
        return Object.entries(tempComponents).map(([id, {componentKey}]) => {
            if (registeredComponents[componentKey]) {
                const children = registeredComponents[componentKey].createFunction()
                return (
                    <React.Fragment key={id}>
                        <Editable __id={id} __tempComponent>
                            {children}
                        </Editable>
                    </React.Fragment>
                )
            } else {
                console.warn(`${componentKey} is not found within registeredComponents`)
                return null
            }
        })
    }, [tempComponents, registeredComponents])
    return (
        <>
            {renderedComponents}
        </>
    )
}

const Scene: React.FC = ({children}) => {
    return (
        <>
            <SceneTempComponents/>
            {children}
        </>
    )
}

export default Scene