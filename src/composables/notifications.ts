import {
    useNow,
    usePermission,
    useStorage,
    useWebNotification,
    watchDebounced,
    type RemovableRef,
} from "@vueuse/core";
import { timer, scheduleShortName, scheduleId } from "./scheduleState";
import ArrayKeyedMap from "array-keyed-map";
import { currentPeriod } from "./periods";
import { offDay } from "./overrides";
import { emptyAllowedNotifications } from "./storage";

const notificationPermission = usePermission("notifications");
const currentDateTime = useNow();

const availableNotifications = new ArrayKeyedMap();
export const notificationMap = {
    oneHour: { array: [0, 1, 0, 0], content: "One hour" },
    thirtyMinutes: { array: [0, 0, 30, 0], content: "Thirty minutes" },
    fifteenMinutes: { array: [0, 0, 15, 0], content: "Fifteen minutes" },
    tenMinutes: { array: [0, 0, 10, 0], content: "Ten minutes" },
    fiveMinutes: { array: [0, 0, 5, 0], content: "Five minutes" },
    oneMinute: { array: [0, 0, 1, 0], content: "One minute" },
    thirtySeconds: { array: [0, 0, 0, 30], content: "Thirty seconds" },
};

Object.entries(notificationMap).forEach(([name, { array }]) =>
    availableNotifications.set(array, name),
);

let storage: RemovableRef<{
    intervals: {
        oneHour: boolean;
        thirtyMinutes: boolean;
        fifteenMinutes: boolean;
        tenMinutes: boolean;
        fiveMinutes: boolean;
        oneMinute: boolean;
        thirtySeconds: boolean;
    };
    days: {
        sunday?: boolean;
        monday?: boolean;
        tuesday?: boolean;
        wednesday?: boolean;
        thursday?: boolean;
        friday?: boolean;
        saturday?: boolean;
    };
    periods: { [periodName: string]: boolean };
} | null> | null = null;

let enabledStorage: RemovableRef<boolean> | null = null;

watchDebounced(
    [timer.days, timer.hours, timer.minutes, timer.seconds],
    () => {
        if (scheduleId.value) {
            if (!storage || !enabledStorage) {
                enabledStorage = useStorage(
                    `schedule.${scheduleId.value}.notifications`,
                    true,
                );
                storage = useStorage(
                    `schedule.${scheduleId.value}.allowedNotifications`,
                    emptyAllowedNotifications.value,
                );
            }

            const notificationArray = [
                timer.days.value,
                timer.hours.value,
                timer.minutes.value,
                timer.seconds.value,
            ];

            if (
                currentPeriod.value &&
                enabledStorage.value &&
                availableNotifications.has(notificationArray) &&
                offDay.value.length === 0 &&
                storage.value
            ) {
                const [name, notificationData] =
                    Object.entries(notificationMap)[
                        Object.keys(notificationMap).indexOf(
                            availableNotifications.get(notificationArray),
                        )
                    ];

                if (
                    (
                        storage.value.intervals as {
                            [interval: string]: boolean;
                        }
                    )[name] &&
                    (storage.value.days as { [dayName: string]: boolean })[
                        currentDateTime.value
                            .toLocaleDateString(undefined, {
                                weekday: "long",
                            })
                            .toLowerCase()
                    ] &&
                    storage.value.periods[currentPeriod.value.name]
                ) {
                    const { isSupported, show } = useWebNotification({
                        title: `${scheduleShortName.value || "Schedules"} - ${
                            currentPeriod.value.name
                        }`,
                        body: `${notificationData.content} remaining`,
                        icon: "/assets/images/favicons/favicon-192.png",
                        lang: "en",
                        dir: "auto",
                    });

                    if (
                        isSupported &&
                        notificationPermission.value === "granted"
                    ) {
                        show();
                    }
                }
            }
        }
    },
    { debounce: 500 },
);
