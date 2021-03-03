import React, {Component, useEffect, useMemo, useRef, useState} from "react"
import {StyledHeading} from "../../ui/typography";
import {useActiveComponentState} from "../../state/editor";
// import {useControls, store} from "leva/dist/leva.cjs.js"
import styled from "styled-components";
import {StyledHeader} from "../../ui/shared";
import {updateComponentModifiedState} from "../../state/main/actions";
import {SPACE_UNITS} from "../../ui/units";
import { StyledThickerButton } from "../../ui/buttons";
import {COLORS} from "../../ui/colors";
import SubComponentsMenu, {CUSTOM_CONFIG_KEYS} from "./SubComponentsMenu";
import {getComponentState} from "../../state/main/getters";
import {Context} from "./ComponentStateMenu.context";
import {ComponentStateData} from "../../state/main/types";
import PredefinedConfig from "./PredefinedConfig";

const useControls: any = {}
const store: any = {}

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

const StyledContent = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto auto;
`

const StyledBottom = styled.div`
  border-top: 1px solid ${COLORS.faint};
  padding: ${SPACE_UNITS.mediumPlus}px ${SPACE_UNITS.medium}px;
  overflow: hidden;
`

const StyledComponents = styled.div`
  border-top: 1px solid ${COLORS.faint};
  padding: ${SPACE_UNITS.mediumPlus}px ${SPACE_UNITS.medium}px;
  overflow: hidden;
`

const predefinedConfigKeys = [
    CUSTOM_CONFIG_KEYS.customConfig,
    CUSTOM_CONFIG_KEYS.rigidBody3d,
    CUSTOM_CONFIG_KEYS.position,
    CUSTOM_CONFIG_KEYS.scale,
]

const filterComponentState = (componentState: ComponentStateData): {
    predefinedConfig: ComponentStateData,
    customConfig: ComponentStateData,
} => {
    const predefinedConfig: ComponentStateData = {}
    const customConfig: ComponentStateData = {}

    Object.entries(componentState).forEach(([key, entry]) => {
        if (predefinedConfigKeys.includes(key)) {
            predefinedConfig[key] = entry
        } else {
            customConfig[key] = entry
        }
    })

    return {
        predefinedConfig,
        customConfig,
    }
}

const ComponentStateMenu: React.FC<{
    name: string,
    uid: string,
}> = ({
    name,
    uid
    }) => {

    const componentState = useActiveComponentState(uid)

    const hasCustomConfig = componentState && componentState[CUSTOM_CONFIG_KEYS.customConfig]

    const {
        predefinedConfig,
        customConfig,
    } = filterComponentState(componentState ?? {})

    console.log('predefinedConfig', predefinedConfig, customConfig)

    const {
        addComponent,
    } = useMemo(() => ({
        addComponent: () => {
            const state = getComponentState(uid)
            if (state) {
                const rigidBodyState = state[CUSTOM_CONFIG_KEYS.rigidBody3d]
                if (rigidBodyState && rigidBodyState.value !== undefined) {
                    return
                }
            }
            updateComponentModifiedState(uid, CUSTOM_CONFIG_KEYS.rigidBody3d, {
                enabled: true,
            })
        },
    }), [uid])

    return (
        <Context.Provider value={{componentId: uid}}>
            <StyledContainer>
                <StyledHeader>
                    <StyledHeading>{name}</StyledHeading>
                </StyledHeader>
                <StyledBody>
                    {/*<Leva fillParent/>*/}
                    {/*<StateManager key={uid} uid={uid}/>*/}
                    <StyledContent>
                        <PredefinedConfig state={predefinedConfig} key={uid}/>
                        {
                            hasCustomConfig && componentState && (
                                <StyledComponents>
                                    <SubComponentsMenu componentState={componentState} key={uid} />
                                </StyledComponents>
                            )
                        }
                        {
                            hasCustomConfig && (
                                <StyledBottom>
                                    <StyledThickerButton full onClick={addComponent}>
                                        Add Component
                                    </StyledThickerButton>
                                </StyledBottom>
                            )
                        }
                    </StyledContent>
                </StyledBody>
            </StyledContainer>
        </Context.Provider>
    )
}

export default ComponentStateMenu