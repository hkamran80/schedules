export interface HourCalculationResponse {
    hours: number;
    minutes: number;
    seconds: number;
}

export enum HourConversionType {
    TwelveHour,
    TwentyFourHour,
}
