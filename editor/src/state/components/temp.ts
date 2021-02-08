import {getComponentsRootList} from "./components";
import {
    ComponentGroup,
    getSelectedComponent,
    getSelectedComponents,
    GroupedComponents,
    useComponentsStateStore
} from "./componentsState";
import {generateUuid} from "../../utils/ids";

export const calculateNewSelectedComponents = (newSelectedIndex: number, uid: string): string[] => {

    const rootList = getComponentsRootList().map(({uid}) => uid)
    const selectedComponents = getSelectedComponents()

    const selectedIndexes: number[] = []

    selectedComponents.forEach((componentUid) => {
        const index = rootList.indexOf(componentUid)
        selectedIndexes.push(index)
    })

    selectedIndexes.sort()

    if (selectedIndexes.length === 0) {
        return [uid]
    }

    if (selectedIndexes.length === 1) {
        const range = selectedIndexes[0]
        if (newSelectedIndex > range) {
            const selectedRange = rootList.slice(range, newSelectedIndex + 1)
            return selectedRange
        } else {
            const selectedRange = rootList.slice(newSelectedIndex, range + 1)
            return selectedRange
        }
    }

    const originalSelection = getSelectedComponent()

    if (!originalSelection) {
        return [uid]
    }

    const originalIndex = rootList.indexOf(originalSelection)

    if (newSelectedIndex > originalIndex) {
        const selectedRange = rootList.slice(originalIndex, newSelectedIndex + 1)
        return selectedRange
    } else {
        const selectedRange = rootList.slice(newSelectedIndex, originalIndex + 1)
        return selectedRange
    }

}

export const groupSelectedComponents = () => {
    const selectedComponents = getSelectedComponents()

    const groupId = generateUuid()

    const newGroup: ComponentGroup = {
        parent: '',
        isOpen: false,
        components: {},
    }
    const groupedComponents: GroupedComponents = {}

    selectedComponents.forEach((componentId) => {
        newGroup.components[componentId] = true
        groupedComponents[componentId] = groupId
    })

    useComponentsStateStore.setState(state => {
        return {
            groups: {
                ...state.groups,
                [groupId]: newGroup,
            },
            groupedComponents: {
                ...state.groupedComponents,
                ...groupedComponents,
            }
        }
    })

}