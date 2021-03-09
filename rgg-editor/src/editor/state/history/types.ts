import {MainStateStore} from "../main/types";

export type HistoryStore = {
    pastSnapshots: MainStateStore[],
    futureSnapshots: MainStateStore[],
}