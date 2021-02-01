import {createContext, useContext, useEffect, useMemo} from "react";
import {ComponentStateData, StateData} from "../state/componentsState";

type State = {
    derivedState: ComponentStateData,
    registerDefaultProp: (key: string, value: any) => void,
    parentPath: string[],
    overrideState: {
        [key: string]: StateData
    },
    isRoot: boolean,
    registerWithParent: (uid: string) => () => void,
}

export const EditableContext = createContext<State>({
    derivedState: {},
    registerDefaultProp: () => {},
    parentPath: [],
    overrideState: {},
    isRoot: true,
    registerWithParent: () => () => {},
})

export const useEditableContext = (): State => {
    return useContext(EditableContext)
}

type Options = {
    defaultValue?: any,
}

export const useInheritedState = (id: string): StateData => {
    const {overrideState} = useEditableContext()
    return useMemo(() => {
        const state: StateData = {}
        Object.entries(overrideState).forEach(([key, value]) => {
            if (key === id) {
                Object.entries(value).forEach(([propKey, propValue]) => {
                    state[propKey] = propValue
                })
            }
        })
        return state
    }, [overrideState])
}

export const useEditableProp = (key: string, options: Options = {}) => {

    const {
        derivedState,
        registerDefaultProp,
    } = useEditableContext()

    useEffect(() => {
        registerDefaultProp(key, options.defaultValue)
    }, [])

    return derivedState[key]?.value ?? options.defaultValue

}

export const useEditableProps = (props: {
    [key: string]: Options,
}): {
    [key: string]: any,
} => {

    const {
        derivedState,
        registerDefaultProp,
    } = useEditableContext()

    useEffect(() => {
        Object.entries(props).forEach(([key, options]) => {
            registerDefaultProp(key, options.defaultValue)
        })
    }, [])

    const combinedState = useMemo(() => {

        const state: {
            [key: string]: any,
        } = {}

        Object.entries(props).forEach(([key, options]) => {
            state[key] = derivedState[key]?.value ?? options.defaultValue
        })

        return state

    }, [derivedState])

    return combinedState

}