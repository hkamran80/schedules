export enum StorageKeyType {
    PERIOD_NAMES = "periodNames",
    DAY_OVERRIDE = "dayOverride",
    ALLOWED_NOTIFICATIONS = "allowedNotifications",
    TWENTY_FOUR_HOUR_STATUS = "twentyFourHourStatus",
    ANALYTICS_STATUS = "analyticsStatus",
    THEME_STATUS = "darkTheme",
}

/*
===== STORAGE KEYS =====

-- CURRENT --
schedule.[id] - period names
schedule.[id].override - day override
allowedNotifications.[id] - allowed notifications

-- NEW --
schedule.[id].periodNames
schedule.[id].dayOverride
schedule.[id].allowedNotifications
*/
