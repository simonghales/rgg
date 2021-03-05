import {ComponentState} from "../components/types";

type StoredComponentState = {
    modifiedState?: StateData
    overriddenState?: {
        [key: string]: boolean,
    }
}

type SharedComponent = {
    appliedState?: StateData,
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