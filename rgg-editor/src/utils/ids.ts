let incrementor = 0

export const generateUid = () => {
    incrementor += 1
    return (Date.now() + incrementor).toString()
}

export const getCombinedId = (ids: string[]) => {
    return ids.join('/')
}