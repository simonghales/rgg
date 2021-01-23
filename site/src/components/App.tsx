import React, {createContext, useContext, useEffect, useRef, useState} from "react"
import EditProvider, {useEditContext} from "./EditProvider";
import shallow from "zustand/shallow";
import Editable, {useProp} from "./Editable";
import { GlobalStyle } from "../ui/global";
import Game from "./Game";

const App: React.FC = () => {

    return (
        <>
            <GlobalStyle/>
            <EditProvider>
                <Game/>
            </EditProvider>
        </>
    )
}

export default App