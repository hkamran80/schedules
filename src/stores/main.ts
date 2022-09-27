import { defineStore } from 'pinia';
import { version } from '../../package.json';
import type { Schedule } from "../types/schedule";
import type { Release } from "../types/releaseNotes";

export const useMainStore = defineStore("main", {
    state: () => {
        return {
            version,
            schedules: {} as Schedule,
            releaseNotes: [] as Release[],
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
        async loadReleaseNotes() {
            this.releaseNotes = (
                (await (
                    await fetch(
                        "https://raw.unisontech.org/schedules/changelog",
                    )
                ).json()) as Release[]
            ).map(({ version, date, changelog }) => {
                return {
                    version,
                    date: new Date(`${date}T20:00:00`).toLocaleDateString(
                        undefined,
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        },
                    ),
                    changelog,
                };
            });
        },
    },
});
