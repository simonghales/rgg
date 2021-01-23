import React, {RefObject, useLayoutEffect, useRef} from "react"
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 220px;
  background-color: #161617;
  color: white;
  padding: 16px;
`

const EditMenu: React.FC<{
    setPortal: (ref: RefObject<HTMLDivElement>) => void,
}> = ({setPortal}) => {

    const portalRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        setPortal(portalRef)
    }, [])

    return (
        <StyledContainer ref={portalRef}></StyledContainer>
    )
}

export default EditMenu