// @ts-ignore
import create from "zustand";
import {persist} from "zustand/middleware";
import {HistoryStore} from "./types";

// @ts-ignore
export const useHistoryStore = create<HistoryStore>(persist(() => ({
    pastSnapshots: [],
    futureSnapshots: [],
}), {
    name: 'historyStore',
    version: 1,
}))