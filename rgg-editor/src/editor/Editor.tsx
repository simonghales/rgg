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
})

const StyledContent = styled('div', {
    width: '100%',
    height: '100%',
})

export const Editor: React.FC = ({children}) => {
    return (
        <>
            <GoogleFontLoader
                fonts={[
                    {
                        font: 'Roboto',
                        weights: [400, 600, 700],
                    },
                ]}
            />
            <StyledContainer>
                <Header/>
                <StyledMain>
                    <StyledSidebar>
                        <ManagerSidebar/>
                    </StyledSidebar>
                    <div>
                        {children}
                    </div>
                    <StyledSidebar css={{
                        width: '$sidebarPlus',
                    }}>
                        <StateSidebar/>
                    </StyledSidebar>
                </StyledMain>
            </StyledContainer>
        </>
    )
}