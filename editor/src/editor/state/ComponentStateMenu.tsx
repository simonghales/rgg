import React, {useEffect, useMemo, useRef, useState} from "react"
import {StyledHeading} from "../../ui/typography";
import {useActiveComponentState} from "../../state/editor";
import {useControls, store} from "leva/dist/leva.cjs.js"
import {updateComponentModifiedState} from "../../state/componentsState";
import styled from "styled-components";
import {StyledHeader} from "../../ui/shared";

export const isStateObj = (value: any) => {
    return (!!value && typeof value === 'object' && value.hasOwnProperty('value'))
}

const State: React.FC<{
    uid: string,
    config?: {
      [key: string]: any,
    },
    stateKey: string,
    defaultValue?: any,
    stateValue: any,
}> = ({uid, stateKey, stateValue, defaultValue, config}) => {

    const localStateRef = useRef({
        initialValue: stateValue,
        firstUpdate: true
    })

    const localValueRef = useRef(stateValue)
    const [isObjDefaultValue] = useState(() => isStateObj(defaultValue))

    useEffect(() => {
        localValueRef.current = stateValue
    }, [stateValue])

    const preppedState = useMemo(() => {
        if (config) {
            return {
                ...config,
                value: stateValue,
            }
        }
        return stateValue
    }, [stateValue, defaultValue])

    const updatedValue = useControls({
        [stateKey]: preppedState,
    })

    useEffect(() => {
        try {
            store.setValueAtPath(stateKey, stateValue)
        } catch (e) {
            // console.error(e)
        }
    }, [defaultValue])

    useEffect(() => {
        try {
            if (!isObjDefaultValue) {
                store.setValueAtPath(stateKey, stateValue)
            }
        } catch (e) {
            // console.error(e)
        }
    }, [stateValue, isObjDefaultValue])

    const value = updatedValue[stateKey]

    useEffect(() => {
        if (localStateRef.current.firstUpdate) {
            localStateRef.current.firstUpdate = false
            return
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
                Object.entries(componentState).map(([key, {value, defaultValue, config}]) => (
                    <State uid={uid} stateKey={key} stateValue={value} defaultValue={defaultValue} config={config} key={`${uid}-${key}`}/>
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
  flex: 1 1 1px;
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