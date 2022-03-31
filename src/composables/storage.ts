import { computed, ref, watchEffect } from "vue";
import { convertShortWeekdayToLong } from "@hkamran/utility-datetime";
import { generateSchedulePeriods } from "./periods";
import { type RemovableRef, useStorage } from "@vueuse/core";
import { scheduleId } from "./scheduleState";
import type { ScheduleDays } from "../types/schedule";
import type { PeriodNames } from "../types/periods";
import type { AllowedNotifications } from "../types/notifications";

const schedule = ref<ScheduleDays | null>(null);
export const setDaySchedule = (newDaySchedule: ScheduleDays) =>
    (schedule.value = newDaySchedule);

// Initial values
export const emptyPeriodNames = computed(() => {
    if (schedule.value) {
        return Object.fromEntries(
            Array.from(
                new Set(
                    Object.values(schedule.value)
                        .flatMap((day) => generateSchedulePeriods(day))
                        .filter(({ allowEditing }) => allowEditing === true),
                ),
            ).map(({ originalName }) => [originalName, ""]),
        );
    }

    return null;
});

export const emptyAllowedNotifications = computed(() => {
    if (schedule.value) {
        return {
            intervals: {
                oneHour: true,
                thirtyMinutes: true,
                fifteenMinutes: true,
                tenMinutes: true,
                fiveMinutes: true,
                oneMinute: true,
                thirtySeconds: true,
            },
            days: Object.fromEntries(
                Object.keys(schedule.value).map((shortDay) => [
                    convertShortWeekdayToLong(shortDay)?.toLowerCase(),
                    true,
                ]),
            ),
            periods: Object.fromEntries(
                Array.from(
                    new Set(
                        Object.values(schedule.value).flatMap((day) =>
                            Object.keys(day),
                        ),
                    ),
                ).map((period) => [period, true]),
            ),
        };
    }

    return null;
});

// Global storage interfaces
export const hour24 = useStorage("hour24", false);
export let periodNames: RemovableRef<PeriodNames | null> | null = null;
export let allowedNotifications: RemovableRef<AllowedNotifications | null> | null =
    null;

watchEffect(() => {
    if (scheduleId.value) {
        periodNames = useStorage(
            `schedule.${scheduleId.value}.periodNames`,
            emptyPeriodNames.value,
        );

        allowedNotifications = useStorage(
            `schedule.${scheduleId.value}.allowedNotifications`,
            emptyAllowedNotifications.value,
        );
    }
});
