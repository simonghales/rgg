import React, {useMemo} from "react"
import OutsideClickHandler from 'react-outside-click-handler';
import { styled } from "./ui/stitches.config"
import {useProxy} from "valtio";
import {uiProxy} from "./state/ui";
import {deleteSelectedComponents, groupComponents, removeDeactivatedComponents} from "./state/immer/actions";
import {useComponentsStore} from "./state/components/store";
import {StyledButton} from "./ui/generics";

const StyledContainer = styled('div', {
    zIndex: '$max',
    backgroundColor: '$darkGrey',
    padding: '$1 0',
    width: '180px',
    border: '1px solid $lightPurple',
    borderRadius: '$1',
})

const StyledOption = styled(StyledButton, {
    width: '100%',
    padding: '$1 $2',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '$1b',
    fontWeight: '$semi',
    '&:hover': {
        backgroundColor: '$purple',
        color: '$white',
    }
})

const closeContextMenu = () => {
    uiProxy.componentContextMenu = {
        visible: false,
    }
}

const useSelectedComponentTypes = (componentIds: string[]) => {
    return useMemo(() => {
        let allRoot = true
        let componentsSelected = false
        let inactiveComponents = false
        let groups = false
        const {components, deactivatedComponents} = useComponentsStore.getState()
        componentIds.forEach((id) => {
            if (components[id]) {
                componentsSelected = true
                const component = components[id]
                if (!component.isRoot) {
                    allRoot = false
                }
            } else if (deactivatedComponents[id]) {
                inactiveComponents = true
            } else {
                groups = true
            }
        })
        return {
            allRoot,
            hasComponents: componentsSelected,
            hasInactiveComponents: inactiveComponents,
            hasGroups: groups,
        }
    }, [componentIds])
}

const ComponentsMenu: React.FC<{
    components: string[]
}> = ({components}) => {

    const {
        allRoot,
        hasComponents,
        hasInactiveComponents,
        hasGroups
    } = useSelectedComponentTypes(components)

    const {
        onDelete,
        onReactivate,
        onGroup,
    } = useMemo(() => ({
        onGroup: () => {
            groupComponents(components)
            closeContextMenu()
        },
        onDelete: () => {
            deleteSelectedComponents()
            closeContextMenu()
        },
        onReactivate: () => {
            removeDeactivatedComponents(components)
            closeContextMenu()
        }
    }), [components])

    const options = useMemo(() => {

        const multipleComponents = components.length > 1

        const allActive = !hasInactiveComponents

        let options: any[] = []

        const canGroup = allRoot

        if (allActive) {
            if (!hasGroups) {
                if (canGroup) {
                    options.push(
                        <StyledOption onClick={onGroup} key="groupComponents">
                            Group component{multipleComponents ? 's' : ''}
                        </StyledOption>
                    )
                }
                options.push(
                    <StyledOption onClick={onDelete} key="delete">
                        Delete component{multipleComponents ? 's' : ''}
                    </StyledOption>
                )
            } else if ((hasComponents || hasGroups) && canGroup) {
                options.push(
                    <StyledOption onClick={onGroup} key="group">
                        Group
                    </StyledOption>
                )
            }
        }
        if (hasInactiveComponents) {
            options.push(
                <StyledOption onClick={onReactivate} key="restore">
                    Restore
                </StyledOption>
            )
        }

        return options
    }, [
        components,
        onDelete,
        onReactivate,
        onGroup,
        hasComponents,
        hasInactiveComponents,
        hasGroups,
        allRoot,
    ])

    return (
        <StyledContainer>
            {
               options
            }
        </StyledContainer>
    )
}

export const ContextMenu: React.FC = () => {

    const {componentContextMenu} = useProxy(uiProxy)

    if (!componentContextMenu.visible) return null

    const {position = [0, 0], components = []} = componentContextMenu

    return (
        <OutsideClickHandler onOutsideClick={closeContextMenu}>
            <div style={{
                position: 'fixed',
                left: `${position[0]}px`,
                top: `${position[1]}px`,
            }}>
                <ComponentsMenu components={components}/>
            </div>
        </OutsideClickHandler>
    )
}
