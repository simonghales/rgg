export enum RigidBodyType {
    DYNAMIC = 'DYNAMIC',
    STATIC = 'STATIC',
    KINEMATIC = 'KINEMATIC',
}

export type RigidBodyState = {
    bodyType?: RigidBodyType,
    mass?: number,
    colliders?: {
        [key: string]: RigidBodyCollider,
    }
}

export enum RigidBodyColliderShape {
    BALL = 'BALL',
    CUBIOD = 'CUBIOD',
}

export type RigidBodyCollider = {
    shape: RigidBodyColliderShape,
    radius?: number,
    hx?: number,
    hy?: number,
    hz?: number,
}