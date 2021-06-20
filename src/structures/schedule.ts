export interface Schedule {
    [id: string]: ScheduleDetails;
}

export interface ScheduleDetails {
    name: string;
    shortName: string;
    icon: string;
    color: string;
    schedule: ScheduleDays;
}

export interface ScheduleDays {
    [shortDay: string]: ScheduleTimes;
}
export interface ScheduleTimes {
    [periodName: string]: string[];
}