import { defineStore } from "pinia";
import type { Schedule } from "../types/schedule";

export const useMainStore = defineStore("main", {
    state: () => {
        return {
            schedules: {} as Schedule,
        };
    },
    getters: {
        getSchedule: (state) => {
            return (scheduleId: string) => {
                if (Object.keys(state.schedules).indexOf(scheduleId) !== -1) {
                    return state.schedules[scheduleId];
                } else {
                    return null;
                }
            };
        },
    },
    actions: {
        async loadSchedules() {
            this.schedules = (await (
                await fetch("https://raw.unisontech.org/schedules/latest")
            ).json()) as Schedule;
        },
    },
});
