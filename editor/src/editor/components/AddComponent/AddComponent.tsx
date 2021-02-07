import React, {useLayoutEffect, useRef, useState} from "react"
import styled from "styled-components";
import AddComponentList from "./AddComponentList";

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;  
`

const StyledBody = styled.div`
  flex: 1 1 1px;
`

const AddComponent: React.FC = () => {

    const searchRef = useRef<HTMLInputElement>(null)
    const [searchValue] = useState('')

    useLayoutEffect(() => {
        searchRef.current?.focus()
    })

    return (
        <StyledContainer>
            {/*<StyledHeader>*/}
            {/*    <input type="text" ref={searchRef}*/}
            {/*           value={searchValue}*/}
            {/*           onChange={event => setSearchValue(event.target.value)}*/}
            {/*           placeholder="Search for component"/>*/}
            {/*</StyledHeader>*/}
            <StyledBody>
                <AddComponentList filter={searchValue}/>
            </StyledBody>
        </StyledContainer>
    )
}

export default AddComponent