import React from "react";
import {EditorTransformMode, setTransformMode, useTransformMode} from "./state/editor";
import {StyledBox} from "./ui/generics";
import {BiExpand, BiMove, BiRotateLeft} from "react-icons/bi";
import {styled} from "./ui/sitches.config";
import {StyledButton} from "./SceneList";

const StyledBoxButton: any = styled(StyledButton, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '26px',
    height: '26px',
    cursor: 'pointer',
    variants: {
        appearance: {
            active: {
                backgroundColor: '$purple',
                color: '$white',
            }
        }
    }
})

export const OverlayControls: React.FC = () => {

    const transformMode = useTransformMode()

    return (
        <StyledBox css={{
            position: 'absolute',
            top: '$1',
            right: '$1',
            zIndex: '$high',
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            backgroundColor: '$darkGrey',
        }}>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.translate ? 'active' : ''}
                             onClick={() => {
                                 setTransformMode(EditorTransformMode.translate)
                             }}>
                <BiMove size={16}/>
            </StyledBoxButton>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.rotate ? 'active' : ''}
                             onClick={() => {
                                 setTransformMode(EditorTransformMode.rotate)
                             }}>
                <BiRotateLeft size={16}/>
            </StyledBoxButton>
            <StyledBoxButton appearance={transformMode === EditorTransformMode.scale ? 'active' : ''}
                             onClick={() => {
                                 setTransformMode(EditorTransformMode.scale)
                             }}>
                <BiExpand size={15}/>
            </StyledBoxButton>
        </StyledBox>
    )
}