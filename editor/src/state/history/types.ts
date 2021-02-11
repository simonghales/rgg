import {StateStore} from "../main/types";

export type HistoryStore = {
    pastSnapshots: StateStore[],
    futureSnapshots: StateStore[],
}