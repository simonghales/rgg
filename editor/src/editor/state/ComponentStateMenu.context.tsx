import {createContext, useContext} from "react";

type State = {
    componentId: string,
}

export const Context = createContext<State>(null as unknown as State)

export const useComponentId = () => {
    return useContext(Context).componentId
}