export type AnyProps = {
    [key: string]: any,
}

export type ComponentState = {
    uid: string,
    name: string,
    children: string[],
    isRoot: boolean,
    componentId?: string,
    componentType?: string,
    unsaved?: boolean,
    initialProps?: AnyProps,
    parentId?: string,
    rootParentId?: string,
}