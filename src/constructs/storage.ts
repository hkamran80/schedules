import { StorageKeyType } from "@/structures/storage";

function generateStorageKey(scheduleId: string, key: StorageKeyType): string {
    if (key === StorageKeyType.TWENTY_FOUR_HOUR_STATUS) {
        return key;
    } else {
        return `schedule.${scheduleId}.${key}`;
    }
}

export function saveToStorage(
    scheduleId: string,
    key: StorageKeyType,
    value: string
): void {
    localStorage.setItem(generateStorageKey(scheduleId, key), value);
}

export function loadFromStorage(
    scheduleId: string,
    key: StorageKeyType
): string | null {
    return localStorage.getItem(generateStorageKey(scheduleId, key));
}

export function deleteFromStorage(
    scheduleId: string,
    key: StorageKeyType
): void {
    localStorage.removeItem(generateStorageKey(scheduleId, key));
}
