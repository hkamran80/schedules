export enum StorageKeys {
    PERIOD_NAMES = "periodNames",
    DAY_OVERRIDE = "dayOverride",
    ALLOWED_NOTIFICATIONS = "allowedNotifications",
    TWENTY_FOUR_HOUR_STATUS = "twentyFourHourStatus",
    ANALYTICS_STATUS = "analyticsStatus",
    THEME_STATUS = "darkTheme",
}

export enum OldStorageKeys {
    ANALYTICS_STATUS = "umamiTracking",
}

export enum OldStorageItems {
    PERIOD_NAMES,
    ALLOWED_NOTIFICATIONS,
    ANALYTICS_STATUS,
}

/*
===== STORAGE KEYS =====

-- Version 2 --
schedule.[id] - period names
schedule.[id].override - day override
allowedNotifications.[id] - allowed notifications

-- Version 3 --
schedule.[id].periodNames
schedule.[id].dayOverride
schedule.[id].allowedNotifications
*/
