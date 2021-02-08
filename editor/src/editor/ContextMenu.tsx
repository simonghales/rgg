import React, {useEffect} from "react"
import RightClickMenu from "./RightClickMenu";
import create from "zustand";

export enum MENU_TYPE {
    SIDEBAR_COMPONENT
}

export const useContextMenuState = create<{
    active: boolean,
    position: {
        x: number,
        y: number,
    },
    menuType: MENU_TYPE | '',
    menuData: any,
}>(() => ({
    active: false,
    position: {
        x: 0,
        y: 0,
    },
    menuType: '',
    menuData: null,
}))

export const showContextMenu = (menuType: MENU_TYPE, x: number, y: number, menuData?: any) => {
    useContextMenuState.setState({
        active: true,
        position: {
            x,
            y,
        },
        menuType,
        menuData,
    })
}

export const hideContextMenu = () => {
    useContextMenuState.setState({
        active: false,
        menuType: '',
        menuData: null,
    })
}

const ContextMenu: React.FC = () => {

    const {active, position} = useContextMenuState(state => ({
        active: state.active,
        position: state.position,
    }))

    useEffect(() => {

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault()
        }

        document.addEventListener("contextmenu", onContextMenu);

        return () => {
            document.removeEventListener("contextmenu", onContextMenu)
        }

    }, [])

    if (!active) return null

    return <RightClickMenu x={position.x} y={position.y} onClose={() => {
                hideContextMenu()
            }}/>
}

export default ContextMenu