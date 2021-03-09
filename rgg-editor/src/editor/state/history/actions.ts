import {useHistoryStore} from "./store";
import {useMainStateStore} from "../main/store";

export const storeSnapshot = () => {
    useHistoryStore.setState(state => {
        const pastSnapshots = state.pastSnapshots.concat([useMainStateStore.getState()])
        if (pastSnapshots.length > 20) {
            pastSnapshots.shift()
        }
        return {
            pastSnapshots,
            futureSnapshots: [],
        }
    })
}

export const undoState = () => {
    const pastSnapshots = useHistoryStore.getState().pastSnapshots
    const newSnapshot = pastSnapshots[pastSnapshots.length - 1]
    if (!newSnapshot) return
    const currentSnapshot = useMainStateStore.getState()
    useMainStateStore.setState(newSnapshot)
    useHistoryStore.setState(state => {
        return {
            pastSnapshots: pastSnapshots.slice(0, pastSnapshots.length - 1),
            futureSnapshots: state.futureSnapshots.concat([currentSnapshot])
        }
    })
}

export const redoState = () => {
    const futureSnapshots = useHistoryStore.getState().futureSnapshots
    const newSnapshot = futureSnapshots[futureSnapshots.length - 1]
    if (!newSnapshot) return
    const currentSnapshot = useMainStateStore.getState()
    useMainStateStore.setState(newSnapshot)
    useHistoryStore.setState(state => {
        return {
            futureSnapshots: futureSnapshots.slice(0, futureSnapshots.length - 1),
            pastSnapshots: state.pastSnapshots.concat([currentSnapshot])
        }
    })
}