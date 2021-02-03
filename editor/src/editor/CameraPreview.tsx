import React, {useLayoutEffect, useRef} from "react"
import styled from "styled-components";
import {editorStateProxy} from "../state/editor";
import {ref} from "valtio";

const StyledContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9999999;
`

const StyledCanvasWrapper = styled.div`
  width: 200px;
  height: 120px;
  background-color: black;
  border: 1px solid black;
  
  canvas {
    width: 100%;
    height: 100%;
  }
  
`

const CameraPreview: React.FC = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useLayoutEffect(() => {
        editorStateProxy.cameraCanvasRef = ref(canvasRef.current as HTMLCanvasElement)
        return () => {
            editorStateProxy.cameraCanvasRef = null
        }
    }, [])

    return (
        <StyledContainer>
            <StyledCanvasWrapper>
                <canvas ref={canvasRef}/>
            </StyledCanvasWrapper>
        </StyledContainer>
    )
}

export default CameraPreview