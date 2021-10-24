import { ref } from "@vue/composition-api";
import {
    NotificationIntervals,
    AllowedNotifications,
} from "@/structures/notifications";

export function loadNotifications(): any {
    const notifications = ref({
        oneHour: false,
        thirtyMinute: false,
        fifteenMinute: false,
        tenMinute: false,
        fiveMinute: false,
        oneMinute: false,
        thirtySecond: false,
    } as NotificationIntervals);
    const allowedNotifications = ref({
        intervals: {},
        days: {},
        periods: {},
    } as AllowedNotifications);

    return { notifications, allowedNotifications };
}
