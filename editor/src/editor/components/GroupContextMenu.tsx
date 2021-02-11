import React from "react"
import {StyledContainer} from "./ComponentContextMenu";
import {removeGroup} from "../../state/main/actions";

const GroupContextMenu: React.FC<{
    uid: string,
    onClose: () => void,
}> = ({
    uid,
    onClose,
                              }) => {
    return (
        <StyledContainer>
            <ul>
                <li>
                    <button onClick={() => {
                        removeGroup(uid)
                        onClose()
                    }}>Remove group</button>
                </li>
                <li>
                    <button>Delete group and children</button>
                </li>
            </ul>
        </StyledContainer>
    )
}

export default GroupContextMenu