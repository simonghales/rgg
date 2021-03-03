import {ComponentIndividualStateData} from "../../../state/main/types";
import {RigidBodyCollider, RigidBodyState} from "./types";

export const getMass = (state: ComponentIndividualStateData) => {
    const value: RigidBodyState = state.value
    return value?.mass ?? 1
}

export const getColliders = (state: ComponentIndividualStateData) => {
    const value: RigidBodyState = state.value
    return value?.colliders ?? {}
}

export const getColliderRadius = (state: RigidBodyCollider) => {
    return state.radius ?? 1
}

export const getColliderCubiodSizes = (state: RigidBodyCollider) => {
    const {
        hx = 0.5,
        hy = 0.5,
        hz = 0.5
    } = state
    return {
        hx,
        hy,
        hz
    }
}