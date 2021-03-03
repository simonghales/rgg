export type AnyProps = {
    [key: string]: any,
}

export type ComponentState = {
    uid: string,
    name: string,
    children: string[],
    isRoot: boolean,
    componentType?: string,
    unsaved?: boolean,
    initialProps?: AnyProps
}