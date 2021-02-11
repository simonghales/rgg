import React, {useMemo} from "react"
import styled from "styled-components";
import OutsideClickHandler from 'react-outside-click-handler';
import root from "react-shadow/styled-components";
import {GlobalStyle} from "../ui/global";
import {MENU_TYPE, useContextMenuState} from "./ContextMenu";
import ComponentContextMenu from "./components/ComponentContextMenu";
import GroupContextMenu from "./components/GroupContextMenu";

const StyledContainer = styled.div<{
    x: number,
    y: number,
}>`
  position: fixed;
  z-index: 999999999999;
  top: 0;
  left: 0;
  transform: translate(${props => props.x}px, ${props => props.y}px);
`

const RightClickMenu: React.FC<{
    x: number,
    y: number,
    onClose: () => void,
}> = ({
    x,
    y,
    onClose,
}) => {

    const {
        menuType,
        menuData
    } = useContextMenuState(state => ({
        menuType: state.menuType,
        menuData: state.menuData,
    }))

    const menu = useMemo(() => {
        switch (menuType) {
            case MENU_TYPE.SIDEBAR_COMPONENT:
                return (
                    <ComponentContextMenu uid={menuData as string} onClose={onClose}/>
                )
            case MENU_TYPE.SIDEBAR_GROUP:
                return (
                    <GroupContextMenu uid={menuData as string} onClose={onClose}/>
                )
            default:
                return null
        }
    }, [menuType, menuData])

    return (
        <OutsideClickHandler onOutsideClick={onClose}>
            <StyledContainer x={x} y={y}>
                <root.div>
                    <GlobalStyle/>
                    {menu}
                </root.div>
            </StyledContainer>
        </OutsideClickHandler>
    )
}

export default RightClickMenu