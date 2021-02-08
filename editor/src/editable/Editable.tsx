import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react"
import {EditableContext, useEditableContext, useInheritedState} from "./context"
import {
    StateData,
    useComponentState,
    useIsComponentDeactivated,
    useIsOnlyComponentSelected
} from "../state/components/componentsState";
import {generateUuid} from "../utils/ids";
import {addComponent, addDeactivatedComponent, removeComponent, removeDeactivatedComponent} from "../state/components/components";
import {setActiveComponentState} from "../state/editor";

type Override = {
    [key: string]: {
        type: string,
        props: {
            [key: string]: any,
        },
        override?: Override,
    }
}

type Config = {
    type?: string,
    override?: Override,
    unsaved?: boolean,
}

type Props = {
    [key: string]: any,
    id: string,
    __config?: Config,
    __customSource?: any,
}

const getComponentId = (config: Config, children: any, id: string) => {
    if (config.type) return config.type
    if (children) {
        const name = (children as any).type.name
        return `__${name}`
    }
    return id
}

export const Editable: React.FC<Props> = ({
                                              children,
                                                id: passedId,
                                              __config: config = {},
                                              ...props
                                            }) => {

    const {
        parentPath,
        overrideState: previousOverrideState,
        isRoot,
        registerWithParent,
    } = useEditableContext()

    const [id] = useState(() => passedId ?? generateUuid())
    const [componentId] = useState(() => getComponentId(config, children, id))
    const [uid] = useState(() => {
        return parentPath.concat([id]).join('/')
    })
    const [name] = useState(() => (children as any).type.displayName || (children as any).type.name || id)

    const [childEditables] = useState(new Set<string>())
    const unsaved = config.unsaved ?? false

    const isDeactivated = useIsComponentDeactivated(uid)

    useEffect(() => {
        if (isDeactivated) {
            addDeactivatedComponent(uid, name, Array.from(childEditables), isRoot, unsaved)
            return () => {
                removeDeactivatedComponent(uid)
            }
        } else {
            addComponent(uid, name, Array.from(childEditables), isRoot, unsaved)
            return () => {
                removeComponent(uid)
            }
        }
    }, [isDeactivated])

    useLayoutEffect(() => {

        if (!isRoot) {
            return registerWithParent(uid)
        }

        return () => {}

    }, [])

    const childRegisterWithParent = useCallback((uid: string) => {
        childEditables.add(uid)
        return () => {
            childEditables.delete(uid)
        }
    }, [])

    const [defaultState, setDefaultState] = useState<StateData>({})
    const initialState = useMemo<StateData>(() => {
        const state: StateData = {}
        Object.entries(props).forEach(([key, value]) => {
            state[key] = {
                value,
            }
        })
        return state
    }, [props])

    const overrideState = useMemo(() => {
        if (!config.override) return previousOverrideState
        const state: {
            [key: string]: {
                [key: string]: any,
            }
        } = {
            ...previousOverrideState,
        }
        Object.entries(config.override).forEach(([key, value]) => {
            if (!state[key]) {
                state[key] = {}
            }
            if (state[key]) {
                Object.entries(value.props).forEach(([propKey, propValue]) => {
                    // parent override takes priority
                    if (!state[key][propKey]) {
                        state[key][propKey] = {
                            value: propValue,
                        }
                    }
                })
            }
        })
        return state
    }, [config.override, previousOverrideState])

    const registerDefaultProp = useCallback((key: string, value: any, config?: {
        [key: string]: any,
    }) => {
        setDefaultState(state => {
            return {
                ...state,
                [key]: {
                    value,
                    config,
                }
            }
        })
    }, [])

    const inheritedState = useInheritedState(id)

    const derivedState = useComponentState(uid, componentId, defaultState, initialState, inheritedState)
    const isSelected = useIsOnlyComponentSelected(uid)

    const getStateValue = useCallback((key: string) => {
        return derivedState[key]?.value ?? undefined
    }, [derivedState])

    useEffect(() => {
        if (!isSelected) return
        setActiveComponentState(uid, derivedState)
    }, [isSelected, derivedState])

    useEffect(() => {
        if (isSelected) {
            return () => {
                setActiveComponentState(uid,null)
            }
        }
        return () => {}
    }, [isSelected])

    if (isDeactivated) {
        return null
    }

    return (
        <EditableContext.Provider value={{
            uid,
            derivedState,
            registerDefaultProp,
            parentPath: parentPath.concat([id]),
            overrideState,
            isRoot: false,
            registerWithParent: childRegisterWithParent,
            getStateValue,
        }}>
            {children}
        </EditableContext.Provider>
    )
}