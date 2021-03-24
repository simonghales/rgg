import {createContext, MutableRefObject, useContext} from "react";

type State = {
    selectComponentsInRangeRef: MutableRefObject<any>
}

export const Context = createContext<State>(null!)

export const useSelectComponentsInRangeRef = () => {
    return useContext(Context).selectComponentsInRangeRef
}