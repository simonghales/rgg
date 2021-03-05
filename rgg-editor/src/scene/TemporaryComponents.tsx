import React, {useMemo} from "react"
import {useUnsavedComponent, useUnsavedComponents} from "../editor/state/main/hooks";
import {ComponentState} from "../editor/state/components/types";
import {Editable} from "./Editable";
import {useAddable} from "./addables";

const UnsavedComponent: React.FC<{
    component: ComponentState
}> = ({component}) => {
    const addable = useAddable(component.componentId ?? '')
    const Component = useMemo(() => {
        return addable?.component
    }, [addable])
    if (!addable) return null
    const props = component.initialProps ?? {}
    return (
        <Editable id={component.uid} _config={{
            name: component.name,
            type: addable.sharedType ? component.componentId : '',
            _unsaved: true,
        }} {...props}>
            {Component && <Component/>}
        </Editable>
    )
}

const TemporaryComponent: React.FC<{
    id: string,
}> = ({id}) => {
    const component = useUnsavedComponent(id)
    if (!component) return null
    return <UnsavedComponent component={component}/>
}

export const TemporaryComponentsList: React.FC<{
    ids: string[],
}> = ({ids}) => {
    return (
        <>
            {
                ids.map((id) => (
                    <TemporaryComponent id={id} key={id}/>
                ))
            }
        </>
    )
}

export const TemporaryComponents: React.FC = () => {
    const unsavedComponents = useUnsavedComponents()
    return (
        <>
            {
                Object.entries(unsavedComponents).map(([key, component]) => {
                    if (!component.isRoot) return null
                    return (
                        <UnsavedComponent key={key} component={component}/>
                    )
                })
            }
        </>
    )
}