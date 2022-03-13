import { ComputedRef } from "@vue/composition-api";

export interface Schedule {
    [id: string]: ScheduleDetails;
}

export interface ScheduleDetails {
    name: string;
    shortName: string;
    icon: string;
    color: string;
    schedule: ScheduleDays;
    offDays: OffDays;
    overrides: ScheduleOverrides
}

export interface ScheduleDays {
    [shortDay: string]: SchedulePeriodTimes;
}
export interface SchedulePeriodTimes {
    [periodName: string]: string[] | SchedulePeriodDetails;
}

export interface SchedulePeriodDetails {
    times: string[];
    allowEditing: boolean;
}

export interface OffDays {
    [offDayName: string]: string[];
}

export interface ScheduleOverrides {
    [date: string]: string;
}

export interface TimetablePeriod {
    name: string;
    start: string;
    end: string;
    color: string;
}

export interface ScheduleMetadata {
    name: string;
    shortName: string;
    schedule: ComputedRef<ScheduleDays>;
    color: ComputedRef<string>;
    icon: ComputedRef<string>;
    offDays: ComputedRef<OffDays>;
    overrides: ComputedRef<ScheduleOverrides>;
}