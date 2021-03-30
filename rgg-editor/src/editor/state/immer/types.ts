import {SceneTreeItem, StateData, StoredComponentState} from "../main/types";
import {ComponentState} from "../components/types";

type SharedComponent = {
    appliedState?: StateData,
}

export type StoreState = {
    componentNames: Record<string, {
        name: string,
    }>,
    components: Record<string, StoredComponentState>,
    sharedComponents: Record<string, SharedComponent>,
    selectedComponents: Record<string, boolean>,
    sceneTree: SceneTreeItem[],
    componentsTree: Record<string, {
        children: string[],
        isExpanded?: boolean,
    }>,
    unsavedComponents: Record<string, ComponentState>,
    deactivatedComponents: Record<string, boolean>,
    groups: Record<string, {
        name: string,
        isExpanded?: boolean,
    }>,
    groupedComponents: Record<string, string>,
    componentsVisibility: Record<string, boolean>,
}