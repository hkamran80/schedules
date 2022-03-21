export type BasicAllowedNotifications = {
    intervals: NotificationIntervals;
};

export type AllowedNotifications = BasicAllowedNotifications & {
    days: NotificationDays;
    periods: NotificationPeriods;
};

export type NotificationDays = {
    sunday?: boolean;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
};

export type NotificationIntervals = {
    oneHour: boolean;
    thirtyMinutes: boolean;
    fifteenMinutes: boolean;
    tenMinutes: boolean;
    fiveMinutes: boolean;
    oneMinute: boolean;
    thirtySeconds: boolean;
};

export type NotificationPeriods = {
    [originalName: string]: boolean;
};

export type AllowedNotificationIntervals =
    | NotificationDays
    | NotificationIntervals
    | NotificationPeriods;

export type RootKeyMatch = {
    [periodName: string]: boolean;
};

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
