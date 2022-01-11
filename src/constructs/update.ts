import {
    StorageKeys,
    OldStorageKeys,
    OldStorageItems,
} from "@/structures/storage";
import { saveToStorage } from "@/constructs/storage";
import { PeriodNames, PeriodNamesError } from "@/structures/periods";
import { importPeriodNames } from "@/constructs/periods";
import {
    AllowedNotifications,
    NotificationSettingsError,
} from "@/structures/notifications";
import { importNotificationSettings } from "@/constructs/notifications";

export function checkExistence(scheduleId: string | null): OldStorageItems[] {
    // eslint-disable-next-line prefer-const
    let items = [];

    if (localStorage.getItem(OldStorageKeys.ANALYTICS_STATUS)) {
        items.push(OldStorageItems.ANALYTICS_STATUS);
    }

    if (scheduleId) {
        if (localStorage.getItem(`schedule.${scheduleId}`)) {
            items.push(OldStorageItems.PERIOD_NAMES);
        }

        if (localStorage.getItem(`allowedNotifications.${scheduleId}`)) {
            items.push(OldStorageItems.ALLOWED_NOTIFICATIONS);
        }
    }

    return items;
}

export function convertAnalytics(): void {
    const oldStatus = localStorage.getItem(OldStorageKeys.ANALYTICS_STATUS);
    if (oldStatus) {
        localStorage.removeItem(OldStorageKeys.ANALYTICS_STATUS);
        saveToStorage("", StorageKeys.ANALYTICS_STATUS, oldStatus);
    }
}

export function convertPeriodNames(
    scheduleId: string
): PeriodNames | PeriodNamesError | null {
    const storageItem = localStorage.getItem(`schedule.${scheduleId}`);
    if (storageItem !== null) {
        localStorage.removeItem(`schedule.${scheduleId}`);
        return importPeriodNames(storageItem, {} as PeriodNames);
    }

    return null;
}

export function convertAllowedNotifications(
    scheduleId: string
): AllowedNotifications | NotificationSettingsError | null {
    const storageItem = localStorage.getItem(
        `allowedNotifications.${scheduleId}`
    );
    if (storageItem !== null) {
        localStorage.removeItem(`allowedNotifications.${scheduleId}`);
        return importNotificationSettings(
            storageItem,
            {} as AllowedNotifications
        );
    }

    return null;
}
