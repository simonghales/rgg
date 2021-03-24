import React from "react"
import {GlobalHotKeys} from "react-hotkeys";
import GoogleFontLoader from "react-google-font-loader"
import "./ui/sitches.config"
import {styled} from "./ui/sitches.config"
import {ManagerSidebar} from "./ManagerSidebar";
import {StateSidebar} from "./StateSidebar";
import {useHotkeysListener} from "./hotkeys";
import {AddingComponentMenu} from "./AddingComponentMenu";
import {ContextMenu} from "./ContextMenu";
import {GlobalHotkeysListener} from "./GlobalHotkeysListener";
import {Header} from "./TopBar";
import {OverlayControls} from "./OverlayControls";
import {hotkeysHandlers, keyMap} from "./state/inputs";

const StyledDefaultContainer = styled('div', {
    color: '$lightPurple',
    fontFamily: '$main',
    fontSize: '$2',
})

const StyledContainer = styled(StyledDefaultContainer, {
    backgroundColor: '$darkGrey',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    overflow: 'hidden',
})

const StyledMain = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    overflow: 'hidden',
})

const StyledSidebar = styled('div', {
    width: '$sidebar',
    backgroundColor: '$darkGreyLighter',
    position: 'relative',
    maxHeight: '100%',
    overflowY:  'hidden',
})

const StyledContent = styled('div', {
    position: 'relative',
})

export const Editor: React.FC = ({children}) => {
    useHotkeysListener()
    return (
        <GlobalHotKeys handlers={hotkeysHandlers} keyMap={keyMap}>
            <GoogleFontLoader
                fonts={[
                    {
                        font: 'Roboto',
                        weights: [400, 500, 600, 700],
                    },
                ]}
            />
            <GlobalHotkeysListener/>
            <StyledContainer>
                <Header/>
                <StyledMain>
                    <StyledSidebar>
                        <ManagerSidebar/>
                        <AddingComponentMenu/>
                    </StyledSidebar>
                    <StyledContent>
                        {children}
                        <OverlayControls/>
                    </StyledContent>
                    <StyledSidebar css={{
                        width: '$sidebarPlus',
                    }}>
                        <StateSidebar/>
                    </StyledSidebar>
                </StyledMain>
                <ContextMenu/>
            </StyledContainer>
        </GlobalHotKeys>
    )
}