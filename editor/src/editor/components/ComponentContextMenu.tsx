import React, {useMemo} from "react"
import styled from "styled-components";
import {COLORS} from "../../ui/colors";
import {useAreMultipleComponentsSelected, useSelectedComponents} from "../../state/components/componentsState";
import {groupSelectedComponents, ungroupComponents, useAreComponentsInsideGroup} from "../../state/components/temp";
import {setMovingComponents} from "../../state/editor";

export const StyledContainer = styled.div`
  width: 200px;
  background-color: ${COLORS.dark};
  padding: 5px;
  border-radius: 3px;
`

const ComponentContextMenu: React.FC<{
    uid: string,
    onClose: () => void,
}> = ({onClose}) => {

    const selectedComponents = Object.keys(useSelectedComponents())
    const insideGroup = useAreComponentsInsideGroup(selectedComponents)

    const {
        onGroupTogether,
        removeFromGroup,
        addToExistingGroup,
    } = useMemo(() => ({
        onGroupTogether: () => {
            groupSelectedComponents()
            onClose()
        },
        removeFromGroup: () => {
            ungroupComponents(selectedComponents)
            onClose()
        },
        addToExistingGroup: (event: any) => {
            event.stopPropagation()
            setMovingComponents(selectedComponents)
            onClose()
        },
    }), [selectedComponents])

    return (
        <StyledContainer>
            <ul>
                {
                    insideGroup && (
                        <li>
                            <button onClick={removeFromGroup}>Remove from group</button>
                        </li>
                    )
                }
                <li>
                    <button onClick={onGroupTogether}>Add to new group</button>
                </li>
                <li>
                    <button onClick={addToExistingGroup}>Move to existing group</button>
                </li>
            </ul>
        </StyledContainer>
    )
}

export default ComponentContextMenu