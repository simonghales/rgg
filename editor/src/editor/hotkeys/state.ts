import {proxy, ref} from "valtio";
import {addNewUnsavedComponent, setSelectedComponents} from "../../state/components/componentsState";
import {getUnsavedComponent, isComponentUnsaved} from "../../state/components/temp";
import {getCreatable} from "../../state/creatables";

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
                    addedComponents.push(addNewUnsavedComponent(creatable, {}, componentId).uid)
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