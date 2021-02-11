import React, {useCallback, useMemo} from "react"
import {ListOfItems, StyledClickable} from "./Component";
import ComponentsContext, {COMPONENTS_PARENT_TYPE} from "./ComponentsContext";
import styled from "styled-components";
import {StyledPlainButton} from "../../ui/buttons";
import {FaFolder, FaFolderOpen} from "react-icons/fa";
import {MENU_TYPE, showContextMenu} from "../ContextMenu";
import {editorStateProxy} from "../../state/editor";
import {useGroup} from "../../state/main/hooks";
import {addComponentsToGroup, setGroupIsOpen, setSelectedComponents} from "../../state/main/actions";
import {SidebarItem} from "../../state/main/types";

const StyledContainer = styled.div``

const StyledChildren = styled.div`
  padding-left: 22px;
  margin-top: 2px;
`

const StyledName = styled.span`
    padding-left: 22px;
`

const StyledWrapper = styled.div`
  position: relative;
`

const StyledButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  bottom: 0;
  display: flex;
  align-items: center;
`

const StyledButton = styled(StyledPlainButton)``

const GroupOfComponents: React.FC<{
    uid: string,
    components: SidebarItem[]
}> = ({uid, components}) => {

    const {isOpen} = useGroup(uid)

    const onRightClick = useCallback((event: MouseEvent) => {
        showContextMenu(MENU_TYPE.SIDEBAR_GROUP, event.pageX, event.pageY, uid)
    }, [])

    const {
        onClick,
    } = useMemo(() => ({
        onClick: () => {
            if (editorStateProxy.movingComponents.length > 0) {
                addComponentsToGroup(editorStateProxy.movingComponents, uid)
            } else {
                setSelectedComponents([])
            }
        }
    }), [])

    return (
        <StyledContainer>
            <StyledWrapper>
                <StyledClickable selected={false} onClick={onClick}
                    // @ts-ignore
                    onContextMenu={onRightClick}>
                    <StyledName>
                        Group
                    </StyledName>
                </StyledClickable>
                <StyledButtonWrapper>
                    <StyledButton faint round onClick={() => {
                        setGroupIsOpen(uid, !isOpen)
                    }}>
                        {
                            isOpen ? (
                                <FaFolderOpen size={12}/>
                            ) : (
                                <FaFolder size={12}/>
                            )
                        }
                    </StyledButton>
                </StyledButtonWrapper>
            </StyledWrapper>
            {
                isOpen && (
                    <StyledChildren>
                        <ComponentsContext type={COMPONENTS_PARENT_TYPE.GROUP} id={uid}>
                            <ListOfItems items={components}/>
                        </ComponentsContext>
                    </StyledChildren>
                )
            }
        </StyledContainer>
    )
}

export default GroupOfComponents