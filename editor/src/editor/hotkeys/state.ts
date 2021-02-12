import {proxy, ref} from "valtio";
import {getCreatable} from "../../state/creatables";
import {addNewUnsavedComponent, setSelectedComponents} from "../../state/main/actions";
import {getUnsavedComponent, getUnsavedComponentInitialProps, isComponentUnsaved} from "../../state/main/getters";

export enum PendingPasteType {
    COMPONENTS = 'COMPONENTS'
}

export type PendingPaste = {
    type: PendingPasteType,
    data: any,
}

export const clipboardProxy = proxy<{
    pendingPaste: PendingPaste | null
}>({
    pendingPaste: null,
})

export const addToClipboard = (pendingPaste: PendingPaste) => {
    clipboardProxy.pendingPaste = ref(pendingPaste)
}

export const clearClipboard = () => {
    clipboardProxy.pendingPaste = null
}

const handlePasteComponents = (components: string[]) => {
    const addedComponents: string[] = []
    components.forEach((componentId) => {
        if (isComponentUnsaved(componentId)) {
            const component = getUnsavedComponent(componentId)
            if (component) {
                const creatable = getCreatable(component.componentType || '')
                if (creatable) {
                    const initialProps = getUnsavedComponentInitialProps(componentId)
                    addedComponents.push(addNewUnsavedComponent(creatable, initialProps, componentId).uid)
                }
            }
        }
    })
    setSelectedComponents(addedComponents)
}

export const handlePaste = () => {
    if (clipboardProxy.pendingPaste) {
        switch (clipboardProxy.pendingPaste.type) {
            case PendingPasteType.COMPONENTS:
                handlePasteComponents(clipboardProxy.pendingPaste.data)
                break;
            default:
                    break;
        }
    }
    clearClipboard()
}