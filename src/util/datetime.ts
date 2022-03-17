const weekdays = {
    SUN: "Sunday",
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
} as { [shortName: string]: string };

export const convertShortWeekdayToLong = (
    shortWeekday: string,
): string | null =>
    Object.keys(weekdays).indexOf(shortWeekday) !== -1
        ? weekdays[shortWeekday]
        : null;

export const convertLongWeekdayToShort = (
    longWeekday: string,
): string | null => {
    const value = Object.values(weekdays).indexOf(longWeekday);

    if (value !== -1) {
        return Object.keys(weekdays)[value];
    } else {
        return null;
    }
};

export const addDays = (date: Date, days: number): number =>
    date.setDate(date.getDate() + days);

export const dateRange = (
    start: Date,
    end: Date,
): Date[] => {
    let dates: Date[] = [];

    const date = new Date(start);
    while (date <= end) {
        dates = [...dates, new Date(date)];
        date.setDate(date.getDate() + 1);
    }

    return dates;
};
