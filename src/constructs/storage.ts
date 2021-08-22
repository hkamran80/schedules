import { StorageKeys } from "@/structures/storage";

function generateStorageKey(scheduleId: string, key: StorageKeys): string {
    if (
        key === StorageKeys.TWENTY_FOUR_HOUR_STATUS ||
        key === StorageKeys.ANALYTICS_STATUS ||
        key === StorageKeys.THEME_STATUS
    ) {
        return key;
    } else {
        return `schedule.${scheduleId}.${key}`;
    }
}

export function saveToStorage(
    scheduleId: string,
    key: StorageKeys,
    value: string
): void {
    localStorage.setItem(generateStorageKey(scheduleId, key), value);
}

export function loadFromStorage(
    scheduleId: string,
    key: StorageKeys
): string | null {
    return localStorage.getItem(generateStorageKey(scheduleId, key));
}

export function deleteFromStorage(scheduleId: string, key: StorageKeys): void {
    localStorage.removeItem(generateStorageKey(scheduleId, key));
}
