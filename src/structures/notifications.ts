export interface BasicAllowedNotifications {
    intervals: NotificationIntervals;
}

export interface AllowedNotifications extends BasicAllowedNotifications {
    days: NotificationDays;
    periods: NotificationPeriods;
}

export interface NotificationDays {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
}

export interface NotificationIntervals {
    oneHour: boolean;
    thirtyMinute: boolean;
    fifteenMinute: boolean;
    tenMinute: boolean;
    fiveMinute: boolean;
    oneMinute: boolean;
    thirtySecond: boolean;
}

export interface NotificationPeriods {
    [originalName: string]: boolean;
}

export type AllowedNotificationIntervals =
    | NotificationDays
    | NotificationIntervals
    | NotificationPeriods;

export enum NotificationContent {
    ONE_HOUR = "One hour remaining",
    THIRTY_MINUTE = "Thirty minutes remaining",
    FIFTEEN_MINUTE = "Fifteen minutes remaining",
    TEN_MINUTE = "Ten minutes remaining",
    FIVE_MINUTE = "Five minutes remaining",
    ONE_MINUTE = "One minute remaining",
    THIRTY_SECOND = "Thirty seconds remaining",
}

export interface RootKeyMatch {
    [periodName: string]: boolean;
}

export enum NotificationType {
    INTERVAL,
    DAY,
    PERIOD,
}

export enum NotificationSettingsError {
    KV_PAIR_ERROR,
    ROOT_KEY_ERROR,
    IMPORT_ERROR,
}
