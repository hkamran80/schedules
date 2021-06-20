import { NewTimes, PrettyDayTime } from "@/structures/datetime";
import { padNumber } from "@/constructs/calculations";

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

export const days = {
    SUN: "Sunday",
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
};

export function getLongDayFromShort(shortenedDay: string): string | null {
    return Object.values(days)[Object.keys(days).indexOf(shortenedDay)] || null;
}
