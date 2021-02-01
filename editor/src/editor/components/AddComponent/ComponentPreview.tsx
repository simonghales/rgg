import React from "react"
import {StyledClickable} from "../Component";

const ComponentPreview: React.FC<{
    uid: string,
    name: string,
    onSelect: () => void,
}> = ({name, onSelect}) => {
    return (
        <div>
            <StyledClickable selected={false} onClick={onSelect}>{name}</StyledClickable>
        </div>
    )
}

export default ComponentPreview