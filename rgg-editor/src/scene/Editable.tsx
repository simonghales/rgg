import React, {createContext, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {
    addComponent,
    addDeactivatedComponent, removeComponent,
    removeDeactivatedComponent,
    setComponentChildren, setComponentInitialProps
} from "../editor/state/components/store";
import {StateData} from "../editor/state/main/types";

interface Config {
    unsaved?: boolean,
    type?: string,
}

const getComponentId = (config: Config, children: any, id: string) => {
    if (config.type) return config.type
    if (children) {
        const name = (children as any).type.name
        return `__${name}`
    }
    return id
}

interface Props {
    id: string,
    _config?: Config,

    [key: string]: any,
}

interface ContextInterface {
    id: string,
    isRoot: boolean,
    parentPath: string[],
    registerWithParent: (id: string) => () => void,
}

const Context = createContext<ContextInterface>({
    id: '',
    isRoot: true,
    parentPath: [],
    registerWithParent: () => () => {
    },
})

const useEditableContext = () => {
    return useContext(Context)
}

export const useEditableId = () => {
    const {id} = useEditableContext()
    return id
}

export const Editable: React.FC<Props> = ({
                                              children,
                                              id,
                                              _config: config = {},
                                                ...props,
                                          }) => {

    const {
        isRoot,
        parentPath,
        registerWithParent,
    } = useEditableContext()

    const [name] = useState(() => (children as any).type.displayName || (children as any).type.name || id)
    const [uid] = useState(() => {
        return parentPath.concat([id]).join('/')
    })
    const [componentId] = useState(() => getComponentId(config, children, id))

    useLayoutEffect(() => {
        registerWithParent(uid)
    }, [])

    useLayoutEffect(() => {
        setComponentInitialProps(uid, props)
    }, [props])

    const [childEditables, setChildEditables] = useState<{
        [id: string]: true,
    }>({})

    const {
        registerChildren
    } = useMemo(() => ({
        registerChildren: (childId: string) => {
            setChildEditables(state => ({
                ...state,
                [childId]: true,
            }))
            return () => {
                setChildEditables(state => {
                    const updated = {
                        ...state,
                    }
                    delete updated[childId]
                    return updated
                })
            }
        },
    }), [])

    const isDeactivated = false
    const unsaved = config.unsaved ?? false

    useEffect(() => {
        if (isDeactivated) {
            addDeactivatedComponent(uid, name, Object.keys(childEditables), isRoot, unsaved)
            return () => {
                removeDeactivatedComponent(uid)
            }
        } else {
            addComponent(uid, name, Object.keys(childEditables), isRoot, unsaved, props)
            return () => {
                removeComponent(uid)
            }
        }
    }, [isDeactivated])

    useEffect(() => {
        if (!isDeactivated) {
            setComponentChildren(uid, Object.keys(childEditables))
        }
    }, [childEditables, isDeactivated])

    const updatedParentPath = useMemo(() => {
        return parentPath.concat(id)
    }, [parentPath])

    if (isDeactivated) return null

    return (
        <Context.Provider value={{
            id,
            isRoot: false,
            parentPath: updatedParentPath,
            registerWithParent: registerChildren,
        }}>
            {children}
        </Context.Provider>
    );
};