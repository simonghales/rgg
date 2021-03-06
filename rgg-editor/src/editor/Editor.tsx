import React from "react"
import GoogleFontLoader from "react-google-font-loader"
import "./ui/sitches.config"

const StyledHeader = styled('header', {
    backgroundColor: '$darkGrey',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    height: '$headerHeight',
    padding: '0 $2'
})
import { styled } from "./ui/sitches.config"
import {ManagerSidebar, StyledPlainButton} from "./ManagerSidebar";
import {FaRedo, FaUndo} from "react-icons/fa";
import {StateSidebar} from "./StateSidebar";
import {useHotkeysListener} from "./hotkeys";
import {AddingComponentMenu} from "./AddingComponentMenu";
import {ContextMenu} from "./ContextMenu";
import { StyledBox } from "./ui/generics"
import {BiExpand, BiMove, BiRotateLeft} from "react-icons/bi";
import {StyledButton} from "./SceneList";
import {EditorTransformMode, setTransformMode, useTransformMode} from "./state/editor";

const StyledHeaderSide = styled('div', {
    width: '300px',
    'h3': {
        fontSize: '$2',
        letterSpacing: '1px',
    }
})

const StyledHeaderMiddle = styled('div', {
    display: 'flex',
    justifyContent: 'center',
})

const StyledHeaderOptions = styled(StyledHeaderSide, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '> *:not(:last-child)': {
        marginRight: '$1',
    }
})

const Header: React.FC = () => {
    return (
        <StyledHeader>
            <StyledHeaderSide>
                <h3>RGG</h3>
            </StyledHeaderSide>
            <StyledHeaderMiddle>
                <StyledPlainButton shape="thinner">
                    Play
                </StyledPlainButton>
            </StyledHeaderMiddle>
            <StyledHeaderOptions>
                <StyledPlainButton shape="thinner" appearance="faint">
                    Discard
                </StyledPlainButton>
                <StyledPlainButton shape="round" appearance="faint">
                    <FaUndo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton shape="round" appearance="faint" disabled>
                    <FaRedo size={9}/>
                </StyledPlainButton>
                <StyledPlainButton shape="thinner">
                    Save
                </StyledPlainButton>
            </StyledHeaderOptions>
        </StyledHeader>
    )
}

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
    gridTemplateRows: 'auto 1fr',
})

const StyledMain = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
})

const StyledSidebar = styled('div', {
    width: '$sidebar',
    backgroundColor: '$darkGreyLighter',
    position: 'relative',
})

const StyledContent = styled('div', {
    position: 'relative',
})

const StyledBoxButton = styled(StyledButton, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '26px',
    height: '26px',
    cursor: 'pointer',
    variants: {
        appearance: {
            active: {
                backgroundColor: '$purple',
                color: '$white',
            }
        }
    }
})

const OverlayControls: React.FC = () => {

    const transformMode = useTransformMode()

    return (
        <StyledBox css={{
            position: 'absolute',
            top: '$1',
            right: '$1',
            zIndex: '$high',
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            backgroundColor: '$darkGrey',
        }}>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.translate ? 'active' : ''}
            onClick={() => {
                setTransformMode(EditorTransformMode.translate)
            }}>
                <BiMove size={16}/>
            </StyledBoxButton>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.rotate ? 'active' : ''}
            onClick={() => {
                setTransformMode(EditorTransformMode.rotate)
            }}>
                <BiRotateLeft size={16}/>
            </StyledBoxButton>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.scale ? 'active' : ''}
            onClick={() => {
                setTransformMode(EditorTransformMode.scale)
            }}>
                <BiExpand size={15}/>
            </StyledBoxButton>
        </StyledBox>
    )
}

export const Editor: React.FC = ({children}) => {
    useHotkeysListener()
    return (
        <>
            <GoogleFontLoader
                fonts={[
                    {
                        font: 'Roboto',
                        weights: [400, 500, 600, 700],
                    },
                ]}
            />
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
        </>
    )
}