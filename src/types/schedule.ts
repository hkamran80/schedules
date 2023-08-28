import type { OffDays, ScheduleOverrides } from "./overrides";

export type Schedule = {
    [id: string]: ScheduleDetails;
};

type BaseSchedule = {
    name: string;
    color: string;
    timezone: string;
    location: string;
    custom?: boolean;
};

export type ScheduleDetails = BaseSchedule & {
    shortName: string;
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

export type ScheduleVariant = BaseSchedule & {
    variants: { id: string; name: string }[];
};
