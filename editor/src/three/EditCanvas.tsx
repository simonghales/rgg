import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef} from "react"
import {EditTools} from "../index";
import {useThree} from "react-three-fiber";
import {OrthographicCamera, PerspectiveCamera} from "three";
import {useIsEditMode, useIsEditModeRef} from "../state/editor";
import {Context} from "./EditCanvas.context";
import TemporaryComponents from "../editor/TemporaryComponents";
import CameraPreviewHandler from "./CameraPreviewHandler";
import {setSelectedComponents, useAreMultipleComponentsSelected} from "../state/components/componentsState";

export const useEditCanvasProps = () => {

    const multipleComponentsSelected = useAreMultipleComponentsSelected()

    return useMemo(() => {
        return {
            onPointerMissed: () => {
                if (multipleComponentsSelected) {
                    setSelectedComponents([])
                }
            }
        }
    }, [multipleComponentsSelected])
}

const EditCanvas: React.FC = ({children}) => {

    const pendingDefaultCamera = useRef<PerspectiveCamera | OrthographicCamera | null>(null)

    const isEditMode = useIsEditMode()
    const isEditModeRef = useIsEditModeRef()

    const {
        raycaster,
        setDefaultCamera: originalSetDefaultCamera,
    } = useThree()

    useLayoutEffect(() => {
        raycaster.layers.enable(31)
    }, [])

    const setDefaultCamera = useCallback((camera: any) => {
        if (isEditModeRef.current) {
            pendingDefaultCamera.current = camera
        } else {
            originalSetDefaultCamera(camera)
        }
    }, [])

    // @ts-ignore
    useEffect(() => {
        const checkForStoredCamera = () => {
            if (pendingDefaultCamera.current) {
                originalSetDefaultCamera(pendingDefaultCamera.current)
                pendingDefaultCamera.current = null
            }
        }
        if (isEditMode) {
            return () => {
                checkForStoredCamera()
            }
        } else {
            checkForStoredCamera()
        }
    }, [isEditMode])

    return (
        <Context.Provider value={{
            setDefaultCamera,
        }}>
            <CameraPreviewHandler/>
            <EditTools/>
            <TemporaryComponents/>
            {children}
        </Context.Provider>
    )
}

export default EditCanvas