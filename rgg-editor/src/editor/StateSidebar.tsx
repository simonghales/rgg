import React, {createContext, useContext} from "react"
import { styled } from "./ui/sitches.config"
import {StyledHeading, StyledPaddedBox, StyledPlainButton} from "./ManagerSidebar";
import {ComponentState} from "./componentEditor/ComponentState";
import {useComponentName, useSoleSelectedComponent} from "./state/main/hooks";
import {useComponentProps} from "./state/props";
import {useComponent} from "./state/components/hooks";

const StyledContainer = styled('div', {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
})

interface ContextState {
    selectedComponent: string,
}

const Context = createContext<ContextState>(null!)

export const useCurrentComponentId = () => {
    return useContext(Context).selectedComponent
}

const SidebarHeader: React.FC<{
    id: string,
}> = ({id}) => {
    const component = useComponent(id)
    const customName = useComponentName(id)
    const name = customName || (component?.name ?? '')
    return (
        <StyledPaddedBox visual="top">
            <StyledHeading>
                {name}
            </StyledHeading>
        </StyledPaddedBox>
    )
}

export const StateSidebar: React.FC = () => {
    const selectedComponent = useSoleSelectedComponent()
    if (!selectedComponent) return null
    return (
        <Context.Provider value={{
            selectedComponent,
        }}>
            <StyledContainer>
                <SidebarHeader id={selectedComponent}/>
                <ComponentState id={selectedComponent} key={selectedComponent}/>
            </StyledContainer>
        </Context.Provider>
    )
}