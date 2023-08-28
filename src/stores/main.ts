import { defineStore } from "pinia";
import { version } from "../../package.json";
import type { Schedule } from "../types/schedule";
import { supabase, getSupabaseSession } from "../composables/auth";

export const useMainStore = defineStore("main", {
    state: () => {
        return {
            version,
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
                await fetch(
                    "https://cfg-schedules.unisontech.org/schedules/schema-3d",
                )
            ).json()) as Schedule;
        },
        async loadCustomSchedules() {
            const supabaseSession = await getSupabaseSession();
            if (supabaseSession) {
                const userId = supabaseSession.user.id;

                const { data } = await supabase.storage
                    .from("schedules")
                    .download(`${userId}/schedules.json`);

                if (data) {
                    const customSchedules = JSON.parse(await data.text());
                    this.schedules = { ...this.schedules, ...customSchedules };
                }
            }
        },
    },
});
