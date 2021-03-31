import React, {createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {
    addComponent,
    addDeactivatedComponent, removeComponent,
    removeDeactivatedComponent,
    setComponentChildren, setComponentInitialProps
} from "../editor/state/components/store";
import {useIsDeactivated, useSelectedComponents} from "../editor/state/immer/hooks";
import {setComponentProps} from "../editor/state/props";
import {EditableModules} from "./EditableModules";
import {getCombinedId} from "../utils/ids";
import {InteractiveMesh} from "./InteractiveMesh";

interface Config {
    name?: string,
    _unsaved?: boolean,
    type?: string,
}

const getComponentId = (config: Config) => {
    if (config.type) return config.type
    return ''
}

interface Props {
    id: string,
    _config?: Config,
    [key: string]: any,
}

interface ContextInterface {
    id: string,
    componentTypeId: string,
    isRoot: boolean,
    parentPath: string[],
    parentId: string,
    rootParentId: string,
    registerWithParent: (id: string) => () => void,
    isSelected: {
        selected: boolean,
        single?: boolean,
    },
    sharedProps: {
        [key: string]: any,
    },
    setSharedProp: (key: string, value: any) => void,
}

const Context = createContext<ContextInterface>({
    id: '',
    componentTypeId: '',
    isRoot: true,
    parentId: '',
    rootParentId: '',
    parentPath: [],
    registerWithParent: () => () => {
    },
    isSelected: {
        selected: false,
    },
    sharedProps: {},
    setSharedProp: () => {},
})

export const useEditableContext = () => {
    return useContext(Context)
}

export const useEditableSharedProp = (key: string) => {
    const {sharedProps} = useEditableContext()
    return sharedProps[key]
}

export const useIsEditableSelected = () => {
    const {isSelected} = useEditableContext()
    return isSelected.selected
}

export const useEditableIsSoleSelected = () => {
    const {isSelected} = useEditableContext()
    return (isSelected.selected && isSelected.single) ?? false
}

export const useEditableId = () => {
    const {id} = useEditableContext()
    return id
}

const useIsSelected = (id: string) => {
    const selectedComponents = useSelectedComponents()
    return useMemo(() => {
        if (Object.keys(selectedComponents).includes(id)) {
            const single = (Object.keys(selectedComponents).length === 1)
            return {
                selected: true,
                single,
            }
        }
        return {
            selected: false,
        }
    }, [id, selectedComponents])
}

export const Editable: React.FC<Props> = ({
                                              children,
                                              id,
                                              _config: config = {},
                                                ...props
                                          }) => {

    const {
        isRoot,
        parentPath,
        registerWithParent,
        parentId,
        rootParentId
    } = useEditableContext()

    const unsaved = config._unsaved ?? false

    const [name] = useState(() => config?.name || (children ? (children as any).type.displayName || (children as any).type.name || id : id))
    const [uid] = useState(() => {
        return unsaved ? id : getCombinedId(parentPath.concat([id]))
    })
    const [componentId] = useState(() => getComponentId(config))

    const isSelected = useIsSelected(uid)
    const isSoleSelected = useMemo(() => {
        return isSelected.selected && isSelected.single
    }, [isSelected])

    useEffect(() => {
        if (!isSoleSelected) return
        return () => {
            setComponentProps(uid, () => ({}))
        }
    }, [isSoleSelected])

    useLayoutEffect(() => {
        return registerWithParent(uid)
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

    const isDeactivated = useIsDeactivated(uid)

    useEffect(() => {
        if (isDeactivated) {
            addDeactivatedComponent(uid, name, Object.keys(childEditables), isRoot, unsaved, parentId, rootParentId)
            return () => {
                removeDeactivatedComponent(uid)
            }
        } else {
            addComponent(uid, name, Object.keys(childEditables), isRoot, unsaved, props, componentId, parentId, rootParentId)
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

    const [sharedProps, setSharedProps] = useState<{
        [key: string]: any,
    }>({})

    const setSharedProp = useCallback((key: string, value: any) => {
        setSharedProps(state => ({
            ...state,
            [key]: value,
        }))
    }, [setSharedProps])

    if (isDeactivated) return null

    return (
        <Context.Provider value={{
            id: uid,
            componentTypeId: componentId,
            isRoot: false,
            parentId: uid,
            rootParentId: isRoot ? uid : rootParentId,
            parentPath: updatedParentPath,
            registerWithParent: registerChildren,
            isSelected,
            sharedProps,
            setSharedProp,
        }}>
            <InteractiveMesh>
                <EditableModules>
                    {children}
                </EditableModules>
            </InteractiveMesh>
        </Context.Provider>
    );
};
