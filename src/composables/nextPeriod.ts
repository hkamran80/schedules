import { convert24HourTo12Hour } from "@hkamran/utility-datetime";
import { computed } from "vue";
import { fixOffsetTime } from "../lib/datetime";
import type { Period } from "../types/periods";
import { currentPeriod, currentTime, schedulePeriods } from "./periods";
import { hour24 } from "./storage";
import { useTimer } from "vue-timer-hook";

type TimeToNextPeriod = {
    period: Period;
    start: string;
    timeUntil: string;
} | null;

export const nextPeriodTimer = useTimer();

const getStartTimeForTimer = (periodTime: string) => {
    const [hours, minutes, seconds] = periodTime
        .split(":")
        .map((time) => Number(time));
    const d = new Date();
    d.setHours(hours, minutes, seconds);

    return d;
};

export const timeToNextPeriod = computed((): TimeToNextPeriod => {
    if (schedulePeriods.value && !currentPeriod.value) {
        const nextPeriods = schedulePeriods.value.filter(
            ({ times }) =>
                times && times.start.replace(/:/gm, "") >= currentTime.value,
        );

        if (nextPeriods[0].times) {
            let start = fixOffsetTime(nextPeriods[0].times.start);
            if (!hour24.value) {
                start = convert24HourTo12Hour(start);
            }

            nextPeriodTimer.restart(
                +getStartTimeForTimer(nextPeriods[0].times.start),
            );

            if (nextPeriods.length !== 0) {
                return {
                    period: nextPeriods[0],
                    start,
                    timeUntil: "TBA",
                };
            }
        }

        return null;
    }

    return null;
});
