export const generateUid = () => {
    return Date.now().toString()
}

export const getCombinedId = (ids: string[]) => {
    return ids.join('/')
}