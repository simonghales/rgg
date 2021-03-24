import {createContext, useContext} from "react";

type State = {
    parentHidden: boolean,
}

export const Context = createContext<State>({
    parentHidden: false,
})

export const useIsParentHidden = () => {
    return useContext(Context).parentHidden
}