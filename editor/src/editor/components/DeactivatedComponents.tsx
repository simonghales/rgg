import React from "react"
import styled from "styled-components";
import {StyledHeading} from "../../ui/typography";
import {StyledHeader as StyledHeaderOriginal} from "../../ui/shared";
import {COLORS} from "../../ui/colors";
import {useDeactivatedComponents} from "../../state/deactivated";
import {StyledIconWrapper, StyledPlainButton} from "../../ui/buttons";
import {FaPlus} from "react-icons/fa";
import {removeDeactivatedComponent} from "../../state/components/componentsState";

const StyledContainer = styled.div`
`

const StyledHeader = styled(StyledHeaderOriginal)`
  border-top: 1px solid ${COLORS.faint};
`

const StyledBody = styled.div`
    max-height: 200px;
    overflow-y: auto;
`

const StyledList = styled.ul`
    padding: 0 22px;

    > li {
      margin: 8px 0;
    }

`

const StyledComponent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  > span {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${COLORS.faintPurple};
  }
  
`

const DeactivatedComponents: React.FC = () => {

    const deactivatedComponents = useDeactivatedComponents()

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledHeading>Deactivated Components</StyledHeading>
            </StyledHeader>
            <StyledBody>
                <StyledList>
                    {
                        deactivatedComponents.map((component) => (
                            <li key={component.uid}>
                                <StyledComponent>
                                    <span>
                                        {component.name}
                                    </span>
                                    <StyledPlainButton round faint onClick={() => {
                                        removeDeactivatedComponent(component.uid)
                                    }}>
                                        <StyledIconWrapper>
                                            <FaPlus size={10}/>
                                        </StyledIconWrapper>
                                    </StyledPlainButton>
                                </StyledComponent>
                            </li>
                        ))
                    }
                </StyledList>
            </StyledBody>
        </StyledContainer>
    )
}

export default DeactivatedComponents