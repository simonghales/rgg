import React, {useMemo} from "react"
import styled from "styled-components";
import {COLORS} from "../../ui/colors";
import {useAreMultipleComponentsSelected} from "../../state/components/componentsState";
import {groupSelectedComponents} from "../../state/components/temp";

const StyledContainer = styled.div`
  width: 200px;
  background-color: ${COLORS.dark};
  padding: 5px;
  border-radius: 3px;
`

const ComponentContextMenu: React.FC<{
    uid: string,
    onClose: () => void,
}> = ({uid, onClose}) => {

    const multipleSelected = useAreMultipleComponentsSelected()

    const {
        onGroupTogether,
    } = useMemo(() => ({
        onGroupTogether: () => {
            groupSelectedComponents()
            onClose()
        }
    }), [uid])

    return (
        <StyledContainer>
            <ul>
                {
                    multipleSelected && (
                        <li>
                            <button onClick={onGroupTogether}>Group together</button>
                        </li>
                    )
                }
            </ul>
        </StyledContainer>
    )
}

export default ComponentContextMenu