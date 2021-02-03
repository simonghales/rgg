import {createContext, useContext} from "react";

export type State = {
    setDefaultCamera: (camera: any) => void,
}
export const Context = createContext<State>(null as unknown as State)

export const useSetDefaultCamera = () => {
    return useContext(Context).setDefaultCamera
}