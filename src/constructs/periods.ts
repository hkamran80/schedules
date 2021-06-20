import { Period, PeriodTimes, PeriodNames } from "@/structures/periods";
import { ScheduleTimes } from "@/structures/schedule";
import { padNumber } from "./calculations";

export function getCurrentPeriod(
    schedule: ScheduleTimes,
    splitTime: string
): Period | null {
    const time = splitTime.split("-").join("");

    const periods = Object.keys(schedule)
        .map((periodName) => {
            const periodTimes = schedule[periodName];
            const start = periodTimes[0].replaceAll("-", ""),
                end = periodTimes[1].replaceAll("-", "");

            if (start <= time && time <= end) {
                return {
                    name: periodName,
                    times: {
                        start: periodTimes[0],
                        end: periodTimes[1],
                    } as PeriodTimes,
                } as Period;
            }

            return null;
        })
        .filter((period) => period !== null);

    if (periods.length === 0) {
        return null;
    }

    return periods[0] as Period;
}

function getPreviousEndTime(endTime: string): string {
    const splitEndTime = endTime.split("-");

    if (splitEndTime[2] !== "59") {
        return (Number(splitEndTime.join("")) + 1).toString();
    } else {
        let hours = Number(splitEndTime[0]),
            minutes = Number(splitEndTime[1]),
            seconds = Number(splitEndTime[2]);

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

export function getNextPeriod(
    schedule: ScheduleTimes,
    currentPeriodEndTime: string
): Period | null {
    const periods = Object.keys(schedule)
        .map((periodName) => {
            const periodTimes = schedule[periodName];
            const start = periodTimes[0].replaceAll("-", "");
            const previousEndTime = getPreviousEndTime(currentPeriodEndTime);

            if (Number(start).toString() === previousEndTime) {
                return {
                    name: periodName,
                    times: {
                        start: periodTimes[0],
                        end: periodTimes[1],
                    } as PeriodTimes,
                } as Period;
            }

            return null;
        })
        .filter((period) => period !== null);

    if (periods.length === 0) {
        return null;
    }

    return periods[0] as Period;
}

export function checkForCustomPeriodName(
    periodName: string,
    periodNames: PeriodNames,
    withPeriod = false
): string {
    if (
        typeof periodNames[periodName] === "undefined" ||
        periodNames[periodName] === ""
    ) {
        return periodName;
    } else {
        return withPeriod
            ? `${periodNames[periodName]} (${periodName})`
            : periodNames[periodName];
    }
}
