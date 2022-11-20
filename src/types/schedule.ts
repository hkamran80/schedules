import type { OffDays, ScheduleOverrides } from "./overrides";

export type Schedule = {
    [id: string]: ScheduleDetails;
};

export type ScheduleDetails = {
    name: string;
    shortName: string;
    color: string;
    timezone: string;
    location: string;
    schedule: ScheduleDays;
    offDays: OffDays;
    overrides: ScheduleOverrides;
};

export type ScheduleDays = {
    [shortDay: string]: SchedulePeriodTimes;
};
export type SchedulePeriodTimes = {
    [periodName: string]: string[] | SchedulePeriodDetails;
};

export type SchedulePeriodDetails = {
    times: string[];
    allowEditing: boolean;
};

export type TimetablePeriod = {
    name: string;
    start: string;
    end: string;
    color: string;
};

export type ScheduleTypes = ScheduleDetails | ScheduleVariant;

export type ScheduleVariant = {
    name: string;
    color: string;
    timezone: string;
    location: string;
    variants: { id: string; name: string }[];
};
