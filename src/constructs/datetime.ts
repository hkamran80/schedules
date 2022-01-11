import {
    DayOverrideError,
    days,
    NewTimes,
    PrettyDayTime,
} from "@/structures/datetime";
import { hourConversion, padNumber } from "@/constructs/calculations";
import { OffDays, ScheduleTimes } from "@/structures/schedule";
import { HourConversionType } from "@/structures/calculations";
import {
    deleteFromStorage,
    loadFromStorage,
    saveToStorage,
} from "@/constructs/storage";
import { StorageKeys } from "@/structures/storage";
import { getValueFromObjectSearch } from "./objects";

export function getShortDay(): string {
    return new Date()
        .toLocaleDateString("en-us", { weekday: "short" })
        .toUpperCase();
}

export function getISODate(): string {
    const d = new Date();
    return (
        d.getFullYear() +
        "-" +
        padNumber(d.getMonth() + 1) +
        "-" +
        padNumber(d.getDate())
    );
}

export function getTimes(useTwentyFourHourTime = false): NewTimes {
    const d = new Date();

    const day = getShortDay();

    const time =
        padNumber(d.getHours().toString()) +
        padNumber(d.getMinutes().toString());

    const splitTime =
        padNumber(d.getHours().toString()) +
        "-" +
        padNumber(d.getMinutes().toString()) +
        "-" +
        padNumber(d.getSeconds().toString());

    const prettyDay = d.toLocaleDateString("en-us", {
        weekday: "long",
    });
    const prettyTime = d.toLocaleString("en-us", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: !useTwentyFourHourTime,
    });

    const prettyDayTime = {
        day: prettyDay,
        time: prettyTime,
    } as PrettyDayTime;

    return {
        day,
        time,
        splitTime,
        prettyDayTime,
    } as NewTimes;
}

function addDays(date: Date, days: number): Date {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);

    return newDate;
}

function getDates(startDate: Date, stopDate: Date): Date[] {
    const dateArray = [];
    let currentDate = startDate;

    while (currentDate <= stopDate) {
        dateArray.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }

    return dateArray;
}

export function checkOffDay(offDays: OffDays): boolean {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset() / 60;
    const finalTzOffset = (tzOffset > 0 ? "+" : "-") + padNumber(tzOffset);
    const dateString =
        date.getFullYear() +
        "-" +
        padNumber(date.getMonth() + 1) +
        "-" +
        padNumber(date.getDate());

    return (
        Object.values(offDays)
            .flatMap((offDayPeriod) =>
                offDayPeriod.length > 1
                    ? getDates(
                          addDays(
                              new Date(
                                  offDayPeriod[0] +
                                      "T12:00:00" +
                                      finalTzOffset +
                                      ":00"
                              ),
                              1
                          ),
                          addDays(
                              new Date(
                                  offDayPeriod[1] +
                                      "T12:00:00" +
                                      finalTzOffset +
                                      ":00"
                              ),
                              1
                          )
                      ).map(
                          (date) =>
                              date.getFullYear() +
                              "-" +
                              padNumber(date.getMonth() + 1) +
                              "-" +
                              padNumber(date.getDate())
                      )
                    : offDayPeriod
            )
            .indexOf(dateString) !== -1
    );
}

export function getLongDayFromShort(shortenedDay: string): string | null {
    return getValueFromObjectSearch(shortenedDay, days);
}

export function setDayOverride(
    shortDayCode: string | null,
    scheduleId: string,
    currentTime: string,
    schedule: ScheduleTimes
): boolean | DayOverrideError {
    if (shortDayCode !== null) {
        const lastElement = Object.keys(schedule).pop();
        if (lastElement) {
            const time = hourConversion(
                HourConversionType.TwentyFourHour,
                schedule[lastElement][1]
            );

            if (Number(currentTime) <= Number(time.replace(":", ""))) {
                saveToStorage(
                    scheduleId,
                    StorageKeys.DAY_OVERRIDE,
                    JSON.stringify({
                        day: shortDayCode,
                        expirationDate: getISODate(),
                        expirationTime: time,
                    })
                );
                return true;
            } else {
                return DayOverrideError.OUT_OF_TIME_ERROR;
            }
        } else {
            return DayOverrideError.ELEMENT_ERROR;
        }
    } else {
        deleteFromStorage(scheduleId, StorageKeys.DAY_OVERRIDE);
        return true;
    }
}

export function getDayOverride(
    scheduleId: string,
    currentTime: string,
    currentOverrideStatus: string | null
): string | DayOverrideError {
    const storageOverrideStatus = loadFromStorage(
        scheduleId,
        StorageKeys.DAY_OVERRIDE
    );
    if (storageOverrideStatus && currentOverrideStatus === null) {
        const overrideData = JSON.parse(storageOverrideStatus);
        if (
            getISODate() === overrideData.expirationDate &&
            Number(currentTime) <=
                Number(overrideData.expirationTime.replace(":", ""))
        ) {
            return overrideData.day;
        } else {
            deleteFromStorage(scheduleId, StorageKeys.DAY_OVERRIDE);
            return DayOverrideError.INVALID_DATA_ERROR;
        }
    } else {
        return DayOverrideError.INVALID_DATA_ERROR;
    }
}

export function getTwentyFourHourStatus(): boolean {
    const state = loadFromStorage("", StorageKeys.TWENTY_FOUR_HOUR_STATUS);

    if (state && state === "true") {
        return true;
    } else {
        return false;
    }
}

export function setTwentyFourHourStatus(newState: boolean): void {
    saveToStorage("", StorageKeys.TWENTY_FOUR_HOUR_STATUS, newState.toString());
}
