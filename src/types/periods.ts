export interface Period {
    name: string;
    originalName?: string;
    times: PeriodTimes | null;
    allowEditing: boolean;
}

export interface PeriodTimes {
    start: string;
    end: string;
}

export interface PeriodNames {
    [originalName: string]: string;
}
