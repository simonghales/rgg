import {ComponentState} from "../components/types";

export type StoredComponentState = {
    modifiedState?: StateData
    overriddenState?: {
        [key: string]: boolean,
    }
}

type SharedComponent = {
    appliedState?: StateData,
}

export type SceneTreeItem = {
    id: string,
    children?: SceneTreeItem[],
    expanded?: boolean,
}

export type MainStateStore = {
    componentNames: {
        [key: string]: {
            name: string,
        },
    },
    components: {
        [key: string]: StoredComponentState
    },
    sharedComponents: {
        [key: string]: SharedComponent,
    },
    selectedComponents: {
        [key: string]: boolean,
    },
    sceneTree: SceneTreeItem[],
    componentsTree: {
        [key: string]: {
            children: string[],
            isExpanded?: boolean,
        }
    },
    unsavedComponents: {
      [key: string]: ComponentState,
    },
    deactivatedComponents: {
        [key: string]: boolean,
    },
    groups: {
        [key: string]: {
            name: string,
            isExpanded?: boolean,
        },
    },
    groupedComponents: {
        [key: string]: string,
    },
}

export type StateData = {
    [key: string]: {
        value: any,
        type?: string,
        config?: {
            [key: string]: any,
        }
    }
}