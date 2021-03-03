export type MainStateStore = {
    componentNames: {
        [key: string]: string,
    },
    components: {},
    selectedComponents: {
        [key: string]: boolean,
    },
    componentsTree: {
        [key: string]: {
            children: string[],
        }
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