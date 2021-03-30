import React, {useCallback, useMemo} from "react";
import {PropOrigin} from "../../state/props";
import {resetComponentProp, setSharedComponentPropValue} from "../../state/immer/actions";
import {styled} from "../../ui/stitches.config";
import {StyledTextButton} from "../../ui/buttons";

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
