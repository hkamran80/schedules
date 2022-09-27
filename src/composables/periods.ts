import { padNumber } from "@hkamran/utility-strings";
import { useDateFormat, useNow } from "@vueuse/core";
import { computed, ref } from "vue";
import type { Period, PeriodTimes } from "../types/periods";
import type {
    SchedulePeriodDetails,
    SchedulePeriodTimes,
} from "../types/schedule";
import { periodNames } from "./storage";

const currentTime = useDateFormat(useNow(), "HHmmss");

const getCustomPeriodName = (originalName: string): string => {
    if (periodNames && periodNames.value && periodNames.value[originalName]) {
        return periodNames.value[originalName] + ` (${originalName})`;
    } else {
        return originalName;
    }
};

export const currentPeriod = computed<Period | null>(() => {
    if (schedulePeriods.value) {
        const currentPeriods = schedulePeriods.value.filter(
            ({ times }) =>
                times &&
                times.start.replace(/-/gm, "") <= currentTime.value &&
                currentTime.value <= times.end.replace(/-/gm, ""),
        );

        if (currentPeriods.length > 0) {
            return {
                ...currentPeriods[0],
                name: getCustomPeriodName(currentPeriods[0].name),
                originalName: currentPeriods[0].name,
            };
        } else {
            return null;
        }
    }

    return null;
});

export const nextPeriod = computed<Period | null>(() => {
    if (schedulePeriods.value && currentPeriod.value) {
        const index = schedulePeriods.value.findIndex(
            ({ name }) => name === currentPeriod.value?.originalName,
        );

        if (schedulePeriods.value.length - 1 !== index) {
            const nextPeriod = schedulePeriods.value[index + 1];
            return {
                ...nextPeriod,
                name: getCustomPeriodName(nextPeriod.name),
                originalName: nextPeriod.name,
            };
        }

        return null;

        // console.debug(index)
    }

    return null;
});

const periods = ref<SchedulePeriodTimes | null>(null);
export const setPeriods = (schedulePeriods: SchedulePeriodTimes) =>
    (periods.value = schedulePeriods);

export const schedulePeriods = computed(
    () =>
        periods.value &&
        generateSchedulePeriods(periods.value as SchedulePeriodTimes),
);

export const generateSchedulePeriods = (schedulePeriods: SchedulePeriodTimes) =>
    Object.keys(schedulePeriods).map((periodName) => {
        const period = schedulePeriods[periodName];
        const periodTimes = Array.isArray(period) ? period : period.times;

        return {
            name: getCustomPeriodName(periodName),
            originalName: periodName,
            times: {
                start: periodTimes[0],
                end: periodTimes[1],
            } as PeriodTimes,
            allowEditing:
                periodName.indexOf("Passing (") === -1 && Array.isArray(period)
                    ? true
                    : (period as SchedulePeriodDetails).allowEditing,
        } as Period;
    });

const getPreviousEndTime = (): string => {
    if (currentPeriod.value && currentPeriod.value.times) {
        const splitEndTime = currentPeriod.value.times.end.split("-");
        const [endHours, endMinutes, endSeconds] = splitEndTime;

        if (endSeconds !== "59") {
            return (Number(splitEndTime.join("")) + 1).toString();
        } else {
            let hours = Number(endHours),
                minutes = Number(endMinutes),
                seconds = Number(endSeconds);

            if (seconds >= 59) {
                minutes += 1;
                seconds = seconds >= 60 ? seconds - 60 : seconds - 59;
            }

            if (minutes >= 59) {
                hours += 1;
                minutes = minutes > 59 ? minutes - 60 : minutes - 59;
            }

            return padNumber(hours) + padNumber(minutes) + padNumber(seconds);
        }
    }

    return "";
};
