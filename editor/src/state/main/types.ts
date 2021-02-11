export type ComponentState = {
    uid: string,
    name: string,
    children: string[],
    isRoot: boolean,
    componentType?: string,
    unsaved?: boolean,
    initialProps?: {
        [key: string]: any,
    }
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

export type ComponentGroup = {
    parent: string,
    isOpen: boolean,
    components: {
        [key: string]: boolean
    }
}

export type GroupedComponents = {
    [key: string]: string
}

type StoredComponentState = {
    modifiedState: StateData
}

type SharedComponent = {
    appliedState: StateData,
}

export type StateStore = {
    componentNames: {
      [key: string]: string,
    },
    components: {
        [key: string]: StoredComponentState
    },
    sharedComponents: {
        [key: string]: SharedComponent,
    },
    selectedComponent: string,
    selectedComponents: {
        [key: string]: boolean,
    },
    unsavedComponents: {
        [key: string]: ComponentState,
    },
    deactivatedComponents: {
        [key: string]: boolean,
    },
    groups: {
        [key: string]: ComponentGroup
    },
    groupedComponents: GroupedComponents
}

export enum StateType {
    default = 'default',
    initial = 'initial',
    applied = 'applied',
    inherited = 'inherited',
    modified = 'modified',
}

export type ComponentIndividualStateData = {
    defaultValue?: any,
    value: any,
    stateType: StateType,
    type?: string,
    config?: {
        [key: string]: any,
    }
}

export type ComponentStateData = {
    [key: string]: ComponentIndividualStateData
}

export type SidebarItem = {
    key: string,
    type: 'component' | 'group',
    children?: SidebarItem[],
}