import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react"
import {Children, EditableChildrenContext, useEditContext} from "./EditProvider";
import shallow from "zustand/shallow";
import EditPanel from "./EditPanel";
import {isEqual} from "lodash-es";
import {proxy, subscribe, useProxy} from "valtio";
import {
    PropsState, resetInheritedComponentProp, setComponentInitialState,
    setComponentModifiedState, setComponentOverridenState,
    useComponentState,
    useInheritedComponentState, useSetComponentChildrenState,
    useSharedComponentState
} from "../state/components";

let idCount = 0

const getUid = (id?: string) => {
    if (id) {
        const split = id.split(':')
        if (split.length > 1) {
            return split[1]
        }
    }
    idCount += 1
    return idCount.toString()
}

const getInstanceId = (children: any) => {
    const name = (children as any).type.name
    const source = (children as any)._source
    return `__${name}`
}

const getId = (id: string = '', children: any) => {
    if (id) {
        const split = id.split(':')
        if (split.length > 0) {
            return split[0]
        }
    }
    return getInstanceId(children)
}

export type InternalProps = {
    [key: string]: {
        [key: string]: any,
        __id: string,
        __props?: InternalProps
    }
}

type State = {
    props: {
        [key: string]: any,
    },
    parentPath: string[],
    registerDefaultProp: (key: string, value: any) => void,
}

const EditableContext = createContext<State>({
    props: {},
    parentPath: [],
    registerDefaultProp: () => {},
})

const applyProps = (uid: string, nestedProps: InternalProps, combinedProps: {
    [key: string]: any,
}) => {
    Object.values(nestedProps).forEach(({__id, __props: subProps, ...otherProps}) => {
        if (__id === uid) {
            Object.entries(otherProps).forEach(([key, value]) => {
                combinedProps[key] = value
            })
        } else if (subProps) {
            applyProps(uid, subProps, combinedProps)
        }
    })
}

export const useProp = (key: string, defaultValue?: any) => {
    const {props, registerDefaultProp} = useContext(EditableContext)

    useEffect(() => {
        registerDefaultProp(key, defaultValue)
    }, [])

    return props[key] ?? defaultValue
}

const useIsSelected = (uid: string) => {
    const {parentPath} = useContext(EditableContext)
    const {selectedComponents} = useEditContext()
    if (uid !== selectedComponents.uid) return false
    if (selectedComponents.parentPath) {
        return isEqual(parentPath, selectedComponents.parentPath)
    }
    return true
}

const useAppliedProps = (id: string) => {
    return useSharedComponentState(id).appliedState
}

const EditableInner: React.FC<{
    [key: string]: any,
    __id?: string,
    __override?: InternalProps,
    __customSource?: any,
    children: any,
}> = ({children, __customSource, __id, __override, ...props}) => {

    const [uid] = useState(() => getUid(__id))

    const name = (children as any).type.name

    const id = getId(__id, children)
    useSetComponentChildrenState(uid, __override ?? {})

    const componentState = useComponentState(uid, props)

    const overriddenProps = componentState.overriddenState ?? {}

    const modifiedProps = componentState.modifiedState ?? {}
    const setModifiedProps = (update: PropsState | ((state: PropsState) => PropsState)) => setComponentModifiedState(uid, update)

    const initialProps = componentState.initialState ?? {}
    const setInitialProps = (update: PropsState | ((state: PropsState) => PropsState)) => setComponentInitialState(uid, update)

    const {parentPath} = useContext(EditableContext)
    const {
        registerEditable,
        updateEditing
    } = useEditContext()

    const inheritedProps = useInheritedComponentState(id, parentPath)

    const clearPropValue = useCallback((key: string) => {
        setComponentOverridenState(uid, state => {
            return {
                ...state,
                [key]: true,
            }
        })
        setInitialProps(state => {
            const updatedState = {
                ...state,
            }
            delete updatedState[key]
            return updatedState
        })
        setModifiedProps(state => {
            const updatedState = {
                ...state,
            }
            delete updatedState[key]
            return updatedState
        })
        resetInheritedComponentProp(id, parentPath, key)
    }, [id, parentPath])

    useEffect(() => {

        return registerEditable(uid, __customSource)

    }, [uid])

    const updateProp = useCallback((key: string, value: any) => {
        setModifiedProps(state => ({
            ...state,
            [key]: value,
        }))
    }, [setModifiedProps])

    const appliedProps = useAppliedProps(id)

    const [defaultProps, setDefaultProps] = useState<{
        [key: string]: any,
    }>({})

    const registerDefaultProp = useCallback((key: string, value: any) => {
        setDefaultProps(state => ({
            ...state,
            [key]: value,
        }))
    }, [])

    const combinedProps = useMemo(() => {

        const sortedInitialProps = {
            ...initialProps
        }

        const sortedInheritedProps = {
            ...inheritedProps
        }

        Object.keys(overriddenProps).forEach((key: string) => {
            delete sortedInitialProps[key]
            delete sortedInheritedProps[key]
        })

        const combined = {
            ...defaultProps,
            ...appliedProps,
            ...sortedInitialProps,
            ...sortedInheritedProps,
            ...modifiedProps,
        }

        return combined

    }, [initialProps, modifiedProps, inheritedProps, appliedProps, defaultProps, overriddenProps])

    const {registerChildren: register} = useContext(EditableChildrenContext)
    const [subChildren, setSubChildren] = useState<Children>({})

    useLayoutEffect(() => {

        return register(uid, id, name)

    }, [])

    useLayoutEffect(() => {

        register(uid, id, name, subChildren)

    }, [subChildren])

    const registerChildren = useCallback((uuid: string, id: string, name: string, sub?: any) => {
        setSubChildren(state => {
            return {
                ...state,
                [uuid]: {
                    id,
                    name,
                    children: sub,
                },
            }
        })
        return () => {
            setSubChildren(state => {
                const updated = {
                    ...state,
                }
                delete updated[uuid]
                return updated
            })
        }
    }, [])

    const isSelected = useIsSelected(uid)

    const transmittedProps = useRef({})

    useEffect(() => {
        transmittedProps.current = {}
    }, [isSelected])

    useEffect(() => {

        if (isSelected) {
            if (!shallow(combinedProps, transmittedProps.current)) {
                transmittedProps.current = combinedProps
                updateEditing(name, combinedProps, updateProp, clearPropValue)
            }
        }

    }, [isSelected, combinedProps, updateProp, clearPropValue])

    return (
        <EditableContext.Provider value={{
            props: combinedProps,
            parentPath: parentPath.concat([uid]),
            registerDefaultProp,
        }}>
            <EditableChildrenContext.Provider value={{
                registerChildren,
            }}>
                {children}
            </EditableChildrenContext.Provider>
        </EditableContext.Provider>
    )
}

export default React.memo(EditableInner)