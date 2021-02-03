import React, {useEffect, useRef} from "react"
import {StyledHeading} from "../../ui/typography";
import {useActiveComponentState} from "../../state/editor";
import {useControls, store} from "leva/dist/leva.cjs.js"
import {updateComponentModifiedState} from "../../state/componentsState";
import styled from "styled-components";
import {StyledHeader} from "../../ui/shared";

const State: React.FC<{
    uid: string,
    stateKey: string,
    stateValue: any,
}> = ({uid, stateKey, stateValue}) => {

    const localStateRef = useRef({
        initialValue: stateValue,
        firstUpdate: true
    })

    const localValueRef = useRef(stateValue)

    useEffect(() => {
        localValueRef.current = stateValue
    }, [stateValue])

    const updatedValue = useControls({
        [stateKey]: stateValue,
    })

    useEffect(() => {
        try {
            store.setValueAtPath(stateKey, stateValue)
        } catch (e) {

        }
    }, [stateValue])

    const value = updatedValue[stateKey]

    useEffect(() => {
        if (localStateRef.current.firstUpdate) {
            localStateRef.current.firstUpdate = false
            if (localStateRef.current.initialValue === value) {
                return
            }
        }
        if (localValueRef.current === value) {
            return
        }
        updateComponentModifiedState(uid, stateKey, value)
    }, [value])

    return null
}

const StateManager: React.FC<{
    uid: string,
}> = ({uid}) => {

    const componentState = useActiveComponentState(uid)

    if (!componentState) {
        return null
    }

    return (
        <>
            {
                Object.entries(componentState).map(([key, {value}]) => (
                    <State uid={uid} stateKey={key} stateValue={value} key={key}/>
                ))
            }
        </>
    )
}

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledBody = styled.div`
  flex: 1;
`

const ComponentStateMenu: React.FC<{
    name: string,
    uid: string,
}> = ({
    name,
    uid
    }) => {

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledHeading>{name}</StyledHeading>
            </StyledHeader>
            <StyledBody>
                {/*<Leva fillParent/>*/}
                <StateManager key={uid} uid={uid}/>
            </StyledBody>
        </StyledContainer>
    )
}

export default ComponentStateMenu