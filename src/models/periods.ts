export interface Period {
    name: string;
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

export enum PeriodNamesError {
    KEY_ERROR,
    IMPORT_ERROR,
}
