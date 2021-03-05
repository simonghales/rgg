import React, {useCallback, useEffect, useMemo, useState} from "react"
import {styled} from "../ui/sitches.config"
import {Prop, PropOrigin, useComponentProps} from "../state/props";
import {resetComponentProp, setComponentPropValue} from "../state/main/actions";
import {useComponent} from "../state/components/hooks";
import {
    modulesProp,
    positionProp,
    predefinedBottomProps,
    predefinedProps,
    rigidBody3dModuleProp,
    rotationProp,
    scaleProp
} from "./config";
import UnknownInput from "./inputs/UnknownInput";
import {ComponentModules, Module} from "./ComponentModules";
import {PropInputOptions} from "./inputs/Options";
import {StyledPaddedBox, StyledPlainButton} from "../ManagerSidebar";

const StyledContainer = styled('div', {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr auto',
})

const StyledProp = styled('div', {
    marginTop: '$2',
})

const StyledHeader = styled('header', {
    display: 'flex',
    alignItems: 'center',
    padding: '0 $3',
    marginBottom: '$1',
    minHeight: '18px',
})

const StyledHeaderLabel = styled('label', {
    fontSize: '$1b',
})

const StyledInputContainer = styled('div', {
    padding: '0 $3',
})

const PropInput: React.FC<{
    componentId: string,
    componentTypeId: string,
    propKey: string,
    value: any,
    propType: string,
}> = ({
    componentId,
    componentTypeId,
    propKey,
    value,
    propType
                       }) => {

    const [inputValue, setInputValue] = useState(value)

    const inputId = `input-${propKey}`

    const propConfig = useMemo(() => {
        return predefinedProps[propKey]
    }, [propKey])

    const label = propConfig?.label ?? propKey

    return (
        <StyledProp>
            <StyledHeader>
                <StyledHeaderLabel htmlFor={inputId}>{label || propKey}</StyledHeaderLabel>
                <PropInputOptions propKey={propKey} propType={propType as PropOrigin} componentId={componentId} componentTypeId={componentTypeId} inputValue={inputValue}/>
            </StyledHeader>
            <StyledInputContainer>
                <Module propType={propType} componentId={componentId} componentTypeId={componentTypeId} value={value} propKey={propKey} onChange={setInputValue}/>
            </StyledInputContainer>
        </StyledProp>
    )
}

const defaultOrder = [positionProp.key, rotationProp.key, scaleProp.key]

const sortProps = ([propA]: [string, any], [propB]: [string, any]) => {
    let propAIndex = defaultOrder.indexOf(propA)
    propAIndex = propAIndex === -1 ? 9999 : propAIndex
    let propBIndex = defaultOrder.indexOf(propB)
    propBIndex = propBIndex === -1 ? 9999 : propBIndex
    return propAIndex - propBIndex
}

const CustomProps: React.FC<{
    componentId: string,
    componentTypeId: string,
    props: {
        [key: string]: Prop,
    }
}> = ({componentId, componentTypeId, props}) => {
    return (
        <div>
            {
                Object.entries(props).sort(sortProps).map(([key, prop]) => (
                    <PropInput componentId={componentId} componentTypeId={componentTypeId} key={key} propKey={key} value={prop.value} propType={prop.type}/>
                ))
            }
        </div>
    )
}

export const ComponentState: React.FC<{
    id: string,
}> = ({id}) => {
    const componentProps = useComponentProps(id)
    const component = useComponent(id)
    const componentTypeId = component?.componentId ?? ''
    const {
        [modulesProp.key]: modules,
        ...remainingProps
    } = componentProps
    const {
        customProps,
        bottomProps
    } = useMemo(() => {
        const customProps: {
            [key: string]: Prop,
        } = {}
        const bottomProps: {
            [key: string]: Prop,
        } = {}
        Object.entries(remainingProps).forEach(([key, prop]) => {
            if (prop.hidden) return
            if (predefinedBottomProps[key]) {
                bottomProps[key] = prop
            } else {
                customProps[key] = prop
            }
        })
        return {
            customProps,
            bottomProps,
        }
    }, [remainingProps])

    const {
        addModule,
    } = useMemo(() => ({
        addModule: () => {
            if (!componentProps[rigidBody3dModuleProp.key] || componentProps[rigidBody3dModuleProp.key].value === undefined) {
                setComponentPropValue(id, rigidBody3dModuleProp.key, {
                    enabled: true,
                })
            }
        }
    }), [componentProps])

    return (
        <>
            <StyledContainer>
                <CustomProps componentId={id} componentTypeId={componentTypeId} props={customProps}/>
                {
                    modules && (
                        <ComponentModules componentId={id} componentTypeId={componentTypeId} props={bottomProps}/>
                    )
                }
            </StyledContainer>
            {
                modules && (
                    <StyledPaddedBox visual="bottom">
                        <StyledPlainButton shape="full" onClick={addModule}>
                            Add Module
                        </StyledPlainButton>
                    </StyledPaddedBox>
                )
            }
        </>
    )
}