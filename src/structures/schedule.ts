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
}

export interface ScheduleDays {
    [shortDay: string]: ScheduleTimes;
}
export interface ScheduleTimes {
    [periodName: string]: string[];
}

export interface OffDays {
    [offDayName: string]: string[];
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
}
