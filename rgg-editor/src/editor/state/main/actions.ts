import {setMainStateStoreState} from "./store";
import {TreeData} from "@atlaskit/tree";
import {MainStateStore} from "./types";

export const setSelectedComponents = (selected: {
    [id: string]: true,
}, replace: boolean = true) => {
    setMainStateStoreState(state => ({
        selectedComponents: replace ? selected : {
            ...state.selectedComponents,
            ...selected,
        }
    }))
}

export const setComponentsTree = (tree: TreeData) => {
    const componentsTree: MainStateStore['componentsTree'] = {}
    Object.values(tree.items).forEach(({id, children}) => {
        componentsTree[id] = {
            children: children as string[],
        }
    })
    setMainStateStoreState({
        componentsTree,
    })
}