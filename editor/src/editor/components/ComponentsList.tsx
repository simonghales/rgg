import React from "react"
import styled from "styled-components";
import {SPACE_UNITS} from "../../ui/units";
import {useComponentsRootList} from "../../state/components/components";
import DeactivatedComponents from "./DeactivatedComponents";
import {useHasDeactivatedComponents} from "../../state/deactivated";
import {useComponentsStateStore} from "../../state/components/componentsState";
import {ListOfItems} from "./Component";
import ComponentsContext, {COMPONENTS_PARENT_TYPE} from "./ComponentsContext";

import { Tree } from "antd";
import {useSidebarItems} from "../../state/components/temp";

const { TreeNode } = Tree;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledMain = styled.div`
  flex: 1 1 1px;
  overflow: hidden;
`

const StyledComponentsContainer = styled.div`
  padding: ${SPACE_UNITS.medium}px 12px;
  height: 100%;
  overflow-y: auto;
`

const StyledDeactivatedContainer = styled.div``

export const useGroups = () => {
    return useComponentsStateStore(state => state.groups)
}

export const useGroupedComponents = () => {
    return useComponentsStateStore(state => state.groupedComponents)
}

export type ListItem = {
    type: string,
    uid: string,
    components?: string[],
}

export const useItems = () => {
    const items: ListItem[] = []
    const components = useComponentsRootList()
    console.log('useItems components', components)
    const groupedComponents = useGroupedComponents()

    const groups: {
        [key: string]: {
            [key: string]: boolean,
        }
    } = {}

    components.forEach((component) => {
        if (!groupedComponents[component.uid]) {
            items.push({
                type: 'component',
                uid: component.uid,
            })
        } else {
            const groupId = groupedComponents[component.uid]
            if (groups[groupId]) {
                groups[groupId][component.uid] = true
            } else {
                groups[groupId] = {
                    [component.uid]: true
                }
            }
        }
    })

    Object.entries(groups).forEach(([groupId, groupComponents]) => {
        items.push({
            type: 'group',
            uid: groupId,
            components: Object.keys(groupComponents)
        })
    })

    return items
}

const ComponentsList: React.FC = () => {

    const sidebarItems = useSidebarItems()

    const hasDeactivated = useHasDeactivatedComponents()

    return (
        <StyledContainer>
            <StyledMain>
                <StyledComponentsContainer>
                    <ComponentsContext type={COMPONENTS_PARENT_TYPE.ROOT}>
                        <ListOfItems items={sidebarItems}/>
                    </ComponentsContext>
                </StyledComponentsContainer>
            </StyledMain>
            {
                hasDeactivated && (
                    <StyledDeactivatedContainer>
                        <DeactivatedComponents/>
                    </StyledDeactivatedContainer>
                )
            }
        </StyledContainer>
    )
}

export default ComponentsList