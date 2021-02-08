import React, {createContext, useContext} from "react"

export enum COMPONENTS_PARENT_TYPE {
    ROOT = 'ROOT',
    GROUP = 'GROUP',
}

type State = {
    type: COMPONENTS_PARENT_TYPE,
    id: string,
}

const Context = createContext(null as unknown as State)

export const useComponentParentContext = () => {
    return useContext(Context)
}

const ComponentsContext: React.FC<{
    type: COMPONENTS_PARENT_TYPE,
    id?: string,
}> = ({children, type, id = ''}) => {
    return (
        <Context.Provider value={{
            type,
            id,
        }}>
            {children}
        </Context.Provider>
    )
}

export default ComponentsContext