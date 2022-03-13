import {
    Period,
    PeriodTimes,
    PeriodNames,
    PeriodNamesError,
} from "@/models/periods";
import { ScheduleDays, SchedulePeriodTimes } from "@/models/schedule";
import { padNumber } from "@/constructs/calculations";
import { loadFromStorage, saveToStorage } from "@/constructs/storage";
import { StorageKeys } from "@/models/storage";
import { getPeriodTimes } from "./schedule";

export function getCurrentPeriod(
    schedule: SchedulePeriodTimes,
    splitTime: string
): Period | null {
    if (schedule === null) {
        return null;
    }

    const time = splitTime.split("-").join("");

    const periods = Object.keys(schedule)
        .map((periodName) => {
            const period = schedule[periodName];
            const periodTimes = getPeriodTimes(period);

            const start = periodTimes[0].replaceAll("-", ""),
                end = periodTimes[1].replaceAll("-", "");

            if (start <= time && time <= end) {
                return {
                    name: periodName,
                    times: {
                        start: periodTimes[0],
                        end: periodTimes[1],
                    } as PeriodTimes,
                    allowEditing: Array.isArray(period)
                        ? true
                        : period.allowEditing,
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
    schedule: SchedulePeriodTimes,
    currentPeriodEndTime: string
): Period | null {
    const periods = Object.keys(schedule)
        .map((periodName) => {
            const period = schedule[periodName];
            const periodTimes = getPeriodTimes(period);

            const start = periodTimes[0].replaceAll("-", "");
            const previousEndTime = getPreviousEndTime(currentPeriodEndTime);

            if (Number(start).toString() === previousEndTime) {
                return {
                    name: periodName,
                    times: {
                        start: periodTimes[0],
                        end: periodTimes[1],
                    } as PeriodTimes,
                    allowEditing: Array.isArray(period)
                        ? true
                        : period.allowEditing,
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

export function loadPeriodNames(
    currentPeriodNames: PeriodNames,
    scheduleId: string,
    schedule: ScheduleDays
): PeriodNames | null {
    if (Object.keys(currentPeriodNames).length === 0) {
        const storageSchedule = loadFromStorage(
            scheduleId,
            StorageKeys.PERIOD_NAMES
        );
        let periodNames: PeriodNames;

        if (storageSchedule !== null) {
            periodNames = JSON.parse(storageSchedule) as PeriodNames;
        } else {
            periodNames = {} as PeriodNames;

            Object.keys(schedule)
                .flatMap((day) => Object.entries(schedule[day]))
                .map((period) => [
                    period[0],
                    Array.isArray(period[1]) ? true : period[1].allowEditing,
                ])
                .filter(
                    (period) =>
                        period[1] === true &&
                        (period[0] as string).indexOf("Passing (") === -1
                )
                .map((period) => period[0] as string)
                .forEach((period: string) => (periodNames[period] = ""));
        }

        return periodNames;
    }

    return null;
}

export function savePeriodNames(
    scheduleId: string,
    periodNames: PeriodNames
): void {
    saveToStorage(
        scheduleId,
        StorageKeys.PERIOD_NAMES,
        JSON.stringify(periodNames)
    );
}

// To check whether the return of the function is the period names or an error, do: `importPeriodNames(...).constructor === Object`. It will return `true` if the function returned the names
export function importPeriodNames(
    importString: string,
    currentPeriodNames: PeriodNames
): PeriodNames | PeriodNamesError {
    try {
        const jsonString = JSON.parse(importString);

        const nameKeys = Object.keys(currentPeriodNames),
            nameMatch =
                Object.keys(jsonString)
                    .map((periodName) => nameKeys.indexOf(periodName))
                    .filter((nameIndex) => nameIndex === -1).length === 0;

        if (nameMatch) {
            return jsonString as PeriodNames;
        } else {
            return PeriodNamesError.KEY_ERROR;
        }
    } catch {
        return PeriodNamesError.IMPORT_ERROR;
    }
}
