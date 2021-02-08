import React, {useState} from "react"
import {ListOfItems, StyledClickable} from "./Component";
import ComponentsContext, {COMPONENTS_PARENT_TYPE} from "./ComponentsContext";
import styled from "styled-components";
import {COLORS} from "../../ui/colors";
import {setGroupIsOpen, useGroup} from "../../state/components/componentsState";

const StyledContainer = styled.div``

const StyledChildren = styled.div`
  padding-left: 8px;
  margin-top: 2px;
`

const GroupOfComponents: React.FC<{
    uid: string,
    components: string[]
}> = ({uid, components}) => {

    const {isOpen} = useGroup(uid)

    return (
        <StyledContainer>
            <StyledClickable selected={false} onClick={() => {
                setGroupIsOpen(uid, !isOpen)
            }}>
                Group
            </StyledClickable>
            {
                isOpen && (
                    <StyledChildren>
                        <ComponentsContext type={COMPONENTS_PARENT_TYPE.GROUP} id={uid}>
                            <ListOfItems items={components.map((component) => ({
                                type: 'component',
                                uid: component,
                            }))}/>
                        </ComponentsContext>
                    </StyledChildren>
                )
            }
        </StyledContainer>
    )
}

export default GroupOfComponents