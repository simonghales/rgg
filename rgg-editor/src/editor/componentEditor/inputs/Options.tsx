import React, {useCallback, useEffect, useMemo} from "react";
import {PropOrigin} from "../../state/props";
import {resetComponentProp, setSharedComponentPropValue} from "../../state/main/actions";
import {StyledTextButton} from "../../ManagerSidebar";
import {styled} from "../../ui/sitches.config";

const StyledHeaderOptions = styled('div', {
    display: 'flex',
    alignItems: 'center',
    '> button': {
        marginLeft: '$1',
    }
})

export const PropInputOptions: React.FC<{
    inputValue: any,
    propType: PropOrigin,
    propKey: string,
    componentId: string,
    componentTypeId: string,
}> = ({inputValue, propType, componentId, propKey, componentTypeId}) => {

    const applyValue = useCallback(() => {
        setSharedComponentPropValue(componentTypeId, propKey, inputValue)
    }, [inputValue])

    const {
        onReset,
    } = useMemo(() => ({
        onReset: () => {
            resetComponentProp(componentId, propKey)
        },
    }), [])

    return (
        <StyledHeaderOptions>
            {
                (propType === PropOrigin.modified || propType === PropOrigin.initial) && (
                    <>
                        <StyledTextButton onClick={onReset}>
                            reset
                        </StyledTextButton>
                        {
                            !!componentTypeId && (
                                <StyledTextButton onClick={applyValue}>
                                    apply
                                </StyledTextButton>
                            )
                        }
                    </>
                )
            }
        </StyledHeaderOptions>
    )
}