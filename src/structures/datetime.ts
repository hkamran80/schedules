export const days = {
    SUN: "Sunday",
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
};

export interface PrettyDayTime {
    day: string;
    time: string;
}

export interface NewTimes {
    day: string;
    time: string;
    splitTime: string;
    prettyDayTime: PrettyDayTime;
}

export enum DayOverrideError {
    OUT_OF_TIME_ERROR,
    ELEMENT_ERROR,
    INVALID_DATA_ERROR,
}
