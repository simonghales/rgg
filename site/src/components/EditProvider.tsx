import React, {createContext, RefObject, useCallback, useContext, useRef, useState} from "react"
import EditMenu from "./EditMenu";
import ComponentsMenu from "./ComponentsMenu";
import styled from "styled-components";
import EditPanel from "./EditPanel";
import {setComponentAppliedState} from "../state/components";
import {globalState, useIsEditMode} from "../state/global";

type SourceData = {
    columnNumber: number,
    fileName: string,
    lineNumber: number,
}

type State = {
    editables: {
        [uid: string]: {
            source: SourceData,
            props: {
                [key: string]: any,
            }
        },
    },
    registerEditable: (uid: string, sourceData: SourceData) => () => void,
    updateEditableProps: (uid: string, props: {[key: string]: any}) => void,
    portal: HTMLDivElement | null,
    selectedComponents: {
        uid: string,
        id: string,
        parentPath?: string[],
    },
    selectComponent: (uid: string, id: string, parentPath?: string[]) => void,
    updateEditing: (name: string, props: {[key: string]: any}, updateProp: (key: string, value: any) => void, clearPropValue: (key: string) => void) => void,
    applyProp: (uid: string, key: string, value: any) => void,
    appliedProps: {
        [key: string]: {
            [key: string]: any,
        }
    },
    hoveredComponent: {
        uid: string,
        id: string,
        parentPath?: string[],
    },
    setHoveredComponent: (uid: string, id: string, parentPath?: string[]) => void,
}

export const Context = createContext<State>(null as unknown as State)

export const useEditContext = (): State => {
    return useContext(Context)
}

export type Children = {
    [key: string]: {
        id: string,
        name: string,
        children: Children,
    }
}

type EditableContextState = {
    registerChildren: (uuid: string, id: string, name: string, sub?: Children) => void
}

export const EditableChildrenContext = createContext(null as unknown as EditableContextState)

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
`

const StyledMain = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
`

const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999999;
`

type AppliedProps = {
    [key: string]: {
        [key: string]: any,
    }
}

const EditProvider: React.FC = ({children}) => {

    const [portal, setPortal] = useState<HTMLDivElement | null>(null)

    const [appliedProps, setAppliedProps] = useState<AppliedProps>({})

    const [editables, setEditables] = useState<{
        [uid: string]: {
            source: SourceData,
            props: {
                [key: string]: any,
            }
        }
    }>({})

    const applyProp = useCallback((id: string, key: string, value: any) => {
        setComponentAppliedState(id, state => {
            return {
                ...state,
                [key]: value,
            }
        })
    }, [])

    const registerEditable = useCallback((uid: string, sourceData: SourceData) => {
        setEditables(state => ({
            ...state,
            [uid]: {
                source: sourceData,
                props: {},
            },
        }))
        return () => {
            setEditables(state => {
                const updated = {
                    ...state,
                }
                delete updated[uid]
                return updated
            })
        }
    }, [])

    const updateEditableProps = useCallback((uid: string, props: {[key: string]: any}) => {
        setEditables(state => {
            const existing = state[uid]
            if (!existing) return state
            return {
                ...state,
                [uid]: {
                    ...existing,
                    props,
                }
            }
        })
    }, [])

    const setPortalElement = useCallback((ref: RefObject<HTMLDivElement>) => {
        setPortal(ref.current)
    }, [])

    const [subChildren, setSubChildren] = useState<Children>({})

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

    const [hoveredComponent, setHoveredComponentState] = useState<{
        uid: string,
        id: string,
        parentPath?: string[],
    }>({
        uid: '',
        id: '',
        parentPath: [],
    })

    const setHoveredComponent = useCallback((uid: string, id: string, parentPath?: string[]) => {
        setHoveredComponentState({
            uid,
            id,
            parentPath,
        })
    }, [])

    const [selectedComponents, setSelectedComponents] = useState<{
        uid: string,
        id: string,
        parentPath?: string[],
    }>({
        uid: '',
        id: '',
        parentPath: [],
    })

    const selectComponent = useCallback((uid: string, id: string, parentPath?: string[]) => {
        setSelectedComponents({
            uid,
            id,
            parentPath,
        })
    }, [])

    const [editing, setEditing] = useState<{
        name: string,
        props: {
            [key: string]: any,
        },
        updateProp: (key: string, value: any) => void,
        clearPropValue: (key: string) => void,
    }>({
        name: '',
        props: {},
        updateProp: () => {},
        clearPropValue: () => {},
    })

    const updateEditing = useCallback((
        name: string,
        props: {[key: string]: any},
        updateProp: (key: string, value: any) => void,
        clearPropValue: (key: string) => void,
    ) => {
        console.log('updateEditing: props', props)
        setEditing({
            name,
            props,
            updateProp,
            clearPropValue,
        })
    }, [])

    const isEditMode = useIsEditMode()

    return (
        <Context.Provider value={{
            editables,
            registerEditable,
            updateEditableProps,
            portal,
            selectedComponents,
            selectComponent,
            updateEditing,
            applyProp,
            appliedProps,
            setHoveredComponent,
            hoveredComponent,
        }}>
            <EditableChildrenContext.Provider value={{
                registerChildren,
            }}>
                <StyledContainer>
                    {
                        isEditMode && (
                            <ComponentsMenu components={subChildren}/>
                        )
                    }
                    <StyledMain>
                        {children}
                        <StyledOverlay>
                            <div onClick={() => globalState.isEditMode = !globalState.isEditMode}>
                                {
                                    isEditMode ? "play" : "edit"
                                }
                            </div>
                        </StyledOverlay>
                    </StyledMain>
                    {
                        isEditMode && (
                            <>
                                <EditMenu setPortal={setPortalElement}/>
                                {
                                    selectedComponents.uid && (
                                        <EditPanel uid={selectedComponents.uid}
                                                   id={selectedComponents.id}
                                                   name={editing.name}
                                                   props={editing.props}
                                                   updateProp={editing.updateProp}
                                                   clearPropValue={editing.clearPropValue}/>
                                    )
                                }
                            </>
                        )
                    }
                </StyledContainer>
            </EditableChildrenContext.Provider>
        </Context.Provider>
    )
}

export default EditProvider