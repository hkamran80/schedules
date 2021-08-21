import {
    AllowedNotifications,
    BasicAllowedNotifications,
    NotificationSettingsError,
    RootKeyMatch,
} from "@/structures/notifications";
import { ScheduleDays } from "@/structures/schedule";
import { StorageKeys } from "@/structures/storage";
import { loadFromStorage, saveToStorage } from "@/constructs/storage";
import { showNotification, defaultEvents } from "@/notifications";

export function notify(title: string, body: string): void {
    showNotification(
        title,
        {
            body: body,
        },
        true,
        defaultEvents
    );
}

export function importNotificationSettings(
    importString: string,
    currentAllowedNotifications: AllowedNotifications
): AllowedNotifications | NotificationSettingsError {
    try {
        const jsonString = JSON.parse(importString);

        const rootKeys = Object.keys(currentAllowedNotifications),
            intervalKeys = Object.keys(currentAllowedNotifications.intervals),
            dayKeys = Object.keys(currentAllowedNotifications.days),
            periodKeys = Object.keys(currentAllowedNotifications.periods);

        // Root key match
        if (
            Object.keys(jsonString)
                .map((key) => rootKeys.indexOf(key))
                .filter((keyIndex) => keyIndex === -1).length === 0
        ) {
            const intervalKeyMatch =
                    Object.keys(jsonString.intervals)
                        .map((key) => intervalKeys.indexOf(key))
                        .filter((keyIndex) => keyIndex === -1).length === 0,
                daysKeyMatch =
                    Object.keys(jsonString.days)
                        .map((key) => dayKeys.indexOf(key))
                        .filter((keyIndex) => keyIndex === -1).length === 0,
                periodsKeyMatch =
                    Object.keys(jsonString.periods)
                        .map((key) => periodKeys.indexOf(key))
                        .filter((keyIndex) => keyIndex === -1).length === 0,
                typeCheck =
                    Object.values(jsonString)
                        .map((rootValue) =>
                            Object.values(rootValue as RootKeyMatch).map(
                                (keyValue) => typeof keyValue
                            )
                        )
                        .flat()
                        .filter((type) => type !== "boolean").length === 0;

            if (
                intervalKeyMatch &&
                daysKeyMatch &&
                periodsKeyMatch &&
                typeCheck
            ) {
                return jsonString as AllowedNotifications;
            } else {
                return NotificationSettingsError.KV_PAIR_ERROR;
            }
        } else {
            return NotificationSettingsError.ROOT_KEY_ERROR;
        }
    } catch {
        return NotificationSettingsError.IMPORT_ERROR;
    }
}

export function loadAllowedNotifications(
    scheduleId: string,
    schedule: ScheduleDays,
    currentAllowedNotifications: AllowedNotifications
): AllowedNotifications {
    const storageAllowedNotifications = loadFromStorage(
        scheduleId,
        StorageKeys.ALLOWED_NOTIFICATIONS
    );
    let allowedNotifications = {
        intervals: {},
        days: {},
        periods: {},
    };

    if (storageAllowedNotifications !== null) {
        allowedNotifications = JSON.parse(
            storageAllowedNotifications
        ) as AllowedNotifications;
    }

    if (Object.keys(allowedNotifications.intervals).length === 0) {
        allowedNotifications.intervals = {
            oneHour: true,
            thirtyMinute: true,
            fifteenMinute: true,
            tenMinute: true,
            fiveMinute: true,
            oneMinute: true,
            thirtySecond: true,
        };
    }

    if (Object.keys(allowedNotifications.days).length === 0) {
        allowedNotifications.days = {
            sunday: true,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
        };
    }

    if (Object.keys(currentAllowedNotifications.periods).length === 0) {
        allowedNotifications.periods = Object.fromEntries(
            Object.values(schedule).flatMap((day) =>
                Object.keys(day).map((daySchedule) => [daySchedule, true])
            )
        );
    }

    return allowedNotifications as AllowedNotifications;
}

export function saveAllowedNotifications(
    scheduleId: string,
    notifications: AllowedNotifications
): void {
    saveToStorage(
        scheduleId,
        StorageKeys.ALLOWED_NOTIFICATIONS,
        JSON.stringify(notifications)
    );
}

export function loadBasicAllowedNotifications(
    scheduleId: string
): BasicAllowedNotifications {
    const storageAllowedNotifications = loadFromStorage(
        scheduleId,
        StorageKeys.ALLOWED_NOTIFICATIONS
    );
    let allowedNotifications = {
        intervals: {},
    };

    if (storageAllowedNotifications !== null) {
        allowedNotifications = JSON.parse(
            storageAllowedNotifications
        ) as BasicAllowedNotifications;
    }

    if (Object.keys(allowedNotifications.intervals).length === 0) {
        allowedNotifications.intervals = {
            oneHour: true,
            thirtyMinute: true,
            fifteenMinute: true,
            tenMinute: true,
            fiveMinute: true,
            oneMinute: true,
            thirtySecond: true,
        };
    }

    return allowedNotifications as BasicAllowedNotifications;
}
