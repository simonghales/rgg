import {MultiNumberInput} from "./inputs/MultiNumberInput";
import {RigidBody3DInput} from "./inputs/RigidBody3DInput";

interface PredefinedProp {
    key: string,
    label: string,
    input?: any,
    defaultValue?: any,
}

export const childrenProp: PredefinedProp = {
    key: '__children',
    label: 'Children',
}

export const modulesProp: PredefinedProp = {
    key: '__modules',
    label: 'Modules',
}

export const rigidBody3dModuleProp: PredefinedProp = {
    key: '__rigidBody3dModule',
    label: 'RigidBody 3D',
    input: RigidBody3DInput,
    defaultValue: undefined
}

export const positionProp: PredefinedProp = {
    key: '__position',
    label: 'Position',
    input: MultiNumberInput,
    defaultValue: {x: 0, y: 0, z: 0,}
}

export const rotationProp: PredefinedProp = {
    key: '__rotation',
    label: 'Rotation',
    input: MultiNumberInput,
    defaultValue: {x: 0, y: 0, z: 0,}
}

export const scaleProp: PredefinedProp = {
    key: '__scale',
    label: 'Scale',
    input: MultiNumberInput,
    defaultValue: {x: 1, y: 1, z: 1,}
}

export const predefinedProps = {
    [positionProp.key]: positionProp,
    [rotationProp.key]: rotationProp,
    [scaleProp.key]: scaleProp,
    [rigidBody3dModuleProp.key]: rigidBody3dModuleProp,
}

export const predefinedBottomProps = {
    [rigidBody3dModuleProp.key]: rigidBody3dModuleProp,
}

export const predefinedPropKeys = {
    position: positionProp.key,
    rotation: rotationProp.key,
    scale: scaleProp.key,
    rigidBody3d: rigidBody3dModuleProp.key,
    modules: modulesProp.key,
    children: childrenProp.key,
}