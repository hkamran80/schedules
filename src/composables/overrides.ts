import { useDateFormat, useNow } from "@vueuse/core";
import { computed, ref } from "vue";
import type { OffDays, ScheduleOverrides } from "../types/overrides";
import { dateRange } from "@hkamran/utility-datetime";

const datetime = useNow();
const date = useDateFormat(datetime, "YYYY-MM-DD");

const offDays = ref<OffDays>({});
const scheduleOverrides = ref<ScheduleOverrides>({});

export const setOffDays = (newOffDays: OffDays) => (offDays.value = newOffDays);
export const setScheduleOverrides = (newScheduleOverrides: ScheduleOverrides) =>
    (scheduleOverrides.value = newScheduleOverrides);

// TODO: Replace with schedule-level timezone
export const timezoneOffset = computed(
    () => datetime.value.getTimezoneOffset() / 60,
);

export const offDay = computed(() =>
    Object.entries(offDays.value)
        .map(([name, dates]) => {
            let range: Date[] = [];
            if (dates.length === 1) {
                range = [
                    new Date(dates[0] + `T${12 + timezoneOffset.value}:00:00`),
                ];
            } else if (dates.length === 2) {
                range = dateRange(
                    new Date(dates[0] + `T${12 + timezoneOffset.value}:00:00`),
                    new Date(dates[1] + `T${12 + timezoneOffset.value}:00:00`),
                );
            }

            return {
                name,
                dates: range.map(
                    (date) => useDateFormat(date, "YYYY-MM-DD").value,
                ),
            };
        })
        .filter(({ dates }) => dates.indexOf(date.value) !== -1),
);

export const lastOffDay = computed(() => {
    if (offDay.value) {
        const lastDay = offDay.value[0].dates[offDay.value[0].dates.length - 1];
        return lastDay === offDay.value[0].dates[0] ? null : lastDay;
    }

    return null;
});
