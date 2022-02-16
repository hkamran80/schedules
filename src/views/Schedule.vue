<template>
    <utds-layout>
        <utds-header
            :title="name"
            :subtitle="prettyDateAndTime"
            :subtitleTooltip="
                dayTime.userOverridenDay !== null
                    ? `Override resets at ${overrideExpirationTime}`
                    : ''
            "
        >
            <template v-slot:icons>
                <v-btn
                    icon
                    color="primary"
                    title="Open Timetable"
                    aria-label="Open Timetable"
                    :disabled="daySchedule === null"
                    @click="timetableDialog = true"
                >
                    <v-icon v-text="mdiCalendarOutline" />
                </v-btn>
                <v-btn
                    icon
                    color="primary"
                    title="Open Schedule Preferences"
                    aria-label="Open Schedule Preferences"
                    @click="settingsDialog = true"
                >
                    <v-icon v-text="mdiCogOutline" />
                </v-btn>
            </template>
        </utds-header>

        <div v-if="!offDay">
            <v-card class="mx-auto" outlined>
                <v-card-title
                    class="title font-weight-regular"
                    v-text="
                        currentPeriod.period !== null
                            ? `${currentPeriod.name} - ${currentPeriod.remainingTime}`
                            : 'No Period'
                    "
                />
            </v-card>
            <v-card class="mx-auto" outlined v-if="nextPeriod.period !== null">
                <v-card-title
                    class="title font-weight-regular"
                    v-text="`${nextPeriod.name} - ${nextPeriod.startTime}`"
                />
            </v-card>
        </div>
        <v-card class="mx-auto" outlined v-else>
            <v-card-title class="title font-weight-regular">
                Enjoy your break!
            </v-card-title>
        </v-card>

        <div v-if="debugMode">
            <v-divider />

            <v-btn text block @click="debugFunction">
                Debug Function
            </v-btn>
        </div>

        <v-dialog v-model="settingsDialog" width="500" scrollable>
            <schedule-settings
                @openPeriodNamesEdit="periodNamesEditDialog = true"
                @openPeriodNamesImport="periodNamesImportDialog = true"
                @openPeriodNamesExport="periodNamesExportDialog = true"
                @openNotificationsEdit="notificationsEditDialog = true"
                @openNotificationsExport="notificationsExportDialog = true"
                @openNotificationsImport="notificationsImportDialog = true"
                @toggleDebugMode="toggleDebugMode"
                @close="settingsDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="timetableDialog" width="750" scrollable>
            <schedule-timetable
                :daySchedule="daySchedule"
                :periodNames="periodNames"
                :color="color"
                @close="timetableDialog = false"
            />
        </v-dialog>

        <v-dialog
            v-model="periodNamesEditDialog"
            width="750"
            scrollable
            persistent
        >
            <period-names-edit
                :key="periodNamesEditDialogForceRender"
                :scheduleId="scheduleId"
                :schedule="schedule"
                :currentPeriodNames="periodNames"
                @update="updatePeriodNames"
                @close="periodNamesEditDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="periodNamesExportDialog" width="750">
            <period-names-export
                :periodNames="periodNames"
                @close="periodNamesExportDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="periodNamesImportDialog" width="750">
            <period-names-import
                :scheduleId="scheduleId"
                :periodNames="periodNames"
                @save="updatePeriodNames"
                @close="periodNamesImportDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="notificationsEditDialog" width="500" scrollable>
            <notifications-edit
                :key="notificationsEditDialogForceRender"
                :scheduleId="scheduleId"
                :currentAllowedNotifications="allowedNotifications"
                @update="updateAllowedNotifications"
                @close="notificationsEditDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="notificationsImportDialog" width="750">
            <notifications-import
                :scheduleId="scheduleId"
                :allowedNotifications="allowedNotifications"
                @save="updateAllowedNotifications"
                @close="notificationsImportDialog = false"
            />
        </v-dialog>

        <v-dialog v-model="notificationsExportDialog" width="750">
            <notifications-export
                :allowedNotifications="allowedNotifications"
                @close="notificationsExportDialog = false"
            />
        </v-dialog>
    </utds-layout>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    ref,
    SetupContext,
} from "@vue/composition-api";
import { UtdsLayout, UtdsHeader } from "utds-component-library";
import { mdiConsoleLine, mdiCalendarOutline, mdiCogOutline } from "@mdi/js";
import { useToast } from "vue-toastification/composition";

const ScheduleSettings = () => import("@/components/ScheduleSettings.vue");
const ScheduleTimetable = () => import("@/components/ScheduleTimetable.vue");
const PeriodNamesEdit = () => import("@/components/PeriodNamesEdit.vue");
const PeriodNamesExport = () => import("@/components/PeriodNamesExport.vue");
const PeriodNamesImport = () => import("@/components/PeriodNamesImport.vue");
const NotificationsEdit = () => import("@/components/NotificationsEdit.vue");
const NotificationsExport = () =>
    import("@/components/NotificationsExport.vue");
const NotificationsImport = () =>
    import("@/components/NotificationsImport.vue");

import { Schedule } from "@/models/schedule";
import { Period, PeriodNames, PeriodNamesError } from "@/models/periods";
import { Nullable } from "@/models/types";
import {
    AllowedNotifications,
    NotificationContent,
    NotificationIntervals,
    NotificationSettingsError,
} from "@/models/notifications";
import { HourConversionType } from "@/models/calculations";
import { OldStorageItems } from "@/models/storage";

import {
    checkExistence,
    convertPeriodNames,
    convertAllowedNotifications,
} from "@/constructs/update";
import { getDayOverride, checkOffDay } from "@/constructs/datetime";
import { getValueFromObjectSearch } from "@/constructs/objects";
import {
    checkForCustomPeriodName,
    getCurrentPeriod,
    getNextPeriod,
} from "@/constructs/periods";
import {
    calculateTimeDifference,
    hourConversion,
    padNumber,
} from "@/constructs/calculations";
import { loadAllowedNotifications, notify } from "@/constructs/notifications";
import {
    notificationsSupported,
    getPermission,
    requestPermission,
} from "@/notifications";

import { loadMetadata } from "@/composables/loadMetadata";
import { loadDatetime } from "@/composables/dateTime";
import { getPeriodNames } from "@/composables/getPeriodNames";
import { loadDialogs } from "@/composables/loadDialogs";

export default defineComponent({
    props: {
        schedules: {
            type: Object as () => Schedule,
            required: true,
            default: function() {
                return {};
            },
        },
    },
    components: {
        UtdsLayout,
        UtdsHeader,
        ScheduleSettings,
        ScheduleTimetable,
        PeriodNamesEdit,
        PeriodNamesExport,
        PeriodNamesImport,
        NotificationsEdit,
        NotificationsImport,
        NotificationsExport,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: any, context: SetupContext) {
        const scheduleId = context.root.$route.params.id;
        const toast = useToast();

        if (typeof props.schedules[scheduleId] === "undefined") {
            context.root.$router.push({
                name: "Home",
                query: { notFound: context.root.$route.path },
            });
        }

        const { name, shortName, schedule, color, offDays } = loadMetadata(
            scheduleId,
            props.schedules
        );

        const oldKeysCheck = checkExistence(scheduleId);

        // Period-specific
        const currentPeriod = ref({
            period: null as Nullable<Period>,
            name: null as Nullable<string>,
            remainingTime: null as Nullable<string>,
        });

        const nextPeriod = ref({
            period: null as Nullable<Period>,
            name: null as Nullable<string>,
            startTime: null as Nullable<string>,
        });

        const periodDifferences = ref({
            previousName: null as Nullable<string>,
            different: false,
        });

        const periodNames = ref(getPeriodNames(scheduleId, schedule.value));

        // Dialogs
        const settingsDialog = ref(false);
        const timetableDialog = ref(false);
        const {
            periodNamesEditDialog,
            periodNamesEditDialogForceRender,
            periodNamesExportDialog,
            periodNamesImportDialog,

            notificationsEditDialog,
            notificationsEditDialogForceRender,
            notificationsExportDialog,
            notificationsImportDialog,
        } = loadDialogs();

        // Notifications
        const notifications = ref({
            oneHour: false,
            thirtyMinute: false,
            fifteenMinute: false,
            tenMinute: false,
            fiveMinute: false,
            oneMinute: false,
            thirtySecond: false,
        } as NotificationIntervals);
        const allowedNotifications = ref(
            loadAllowedNotifications(scheduleId, schedule.value, {
                intervals: {},
                days: {},
                periods: {},
            } as AllowedNotifications)
        );

        // Date and Time
        const {
            dayTime,
            prettyDateAndTime,
            twentyFourHourStatus,
            getNewTimes,
        } = loadDatetime();
        const offDay = ref<boolean>(false);

        // Other
        const debugMode = ref(context.root.$route.query.debug === "true");
        const mainInterval = ref(null as Nullable<number>);

        // Computed
        const currentDay = computed(() =>
            dayTime.value.userOverridenDay
                ? dayTime.value.userOverridenDay
                : dayTime.value.day
                ? dayTime.value.day
                : "MON"
        );
        const daySchedule = computed(() =>
            getValueFromObjectSearch(currentDay.value, schedule.value)
        );
        const overrideExpirationTime = computed(() => "TBA");

        // Functions
        const checkPeriodNamesNotFilled = () => {
            const periodNameValues = Object.values(periodNames.value);
            return (
                periodNameValues.filter((name) => name === "").length ===
                periodNameValues.length
            );
        };

        const toggleDebugMode = () => {
            debugMode.value = !debugMode.value;

            if (debugMode.value === true) {
                context.root.$router.replace({
                    name: "Schedule",
                    params: { id: scheduleId },
                    query: { debug: "true" },
                });
            } else {
                context.root.$router.replace({
                    name: "Schedule",
                    params: { id: scheduleId },
                });
            }
        };
        const debugFunction = () => {
            console.debug("=== DEBUG ===");
            console.debug(checkPeriodNamesNotFilled());
            console.debug(Object.values(periodNames.value));
        };

        const periodNamesTips = () => {
            if (checkPeriodNamesNotFilled()) {
                // Two minute timeout
                setTimeout(() => {
                    if (checkPeriodNamesNotFilled()) {
                        toast.info(
                            "Tip: Name periods by clicking the settings icon, then clicking Edit under the Period Names header."
                        );

                        notify(
                            "Schedules - Tips and Tricks",
                            "Tip: Name periods by clicking the settings icon, then clicking Edit under the Period Names header. For more info, go to the help center on the homepage."
                        );
                    }
                }, 180000);
            }
        };

        const loadDayOverride = () => {
            const dayOverride = getDayOverride(
                scheduleId,
                dayTime.value.time || "130400",
                dayTime.value.userOverridenDay
            );

            if (dayOverride.constructor === String) {
                dayTime.value.userOverridenDay = dayOverride;
            } else {
                dayTime.value.userOverridenDay = null;
            }
        };

        const updatePeriodNames = (newPeriodNames: PeriodNames) => {
            periodNames.value = newPeriodNames;
            periodNamesEditDialogForceRender.value += 1;
        };
        const updateAllowedNotifications = (
            newAllowedNotifications: AllowedNotifications,
            rerender = false
        ) => {
            allowedNotifications.value = newAllowedNotifications;
            if (rerender) {
                notificationsEditDialogForceRender.value += 1;
            }
        };

        const conversion = (existences: OldStorageItems[]) => {
            if (existences.indexOf(OldStorageItems.PERIOD_NAMES)) {
                const convertedPeriodNames = convertPeriodNames(scheduleId);
                if (convertedPeriodNames !== null) {
                    if (
                        (convertedPeriodNames as PeriodNames | PeriodNamesError)
                            .constructor === Object
                    ) {
                        updatePeriodNames(convertedPeriodNames as PeriodNames);
                    } else if (
                        convertedPeriodNames === PeriodNamesError.KEY_ERROR
                    ) {
                        toast.error(
                            "An error occurred trying to convert your old period names. Please manually add them via the settings menu."
                        );
                    } else {
                        toast.error(
                            "Unable to convert period names due to an unknown error. Please manually add your period names via the settings menu."
                        );
                    }
                }
            }

            if (existences.indexOf(OldStorageItems.ALLOWED_NOTIFICATIONS)) {
                const convertedAllowedNotifications = convertAllowedNotifications(
                    scheduleId
                );
                if (convertedAllowedNotifications !== null) {
                    if (
                        (convertedAllowedNotifications as
                            | AllowedNotifications
                            | NotificationSettingsError).constructor === Object
                    ) {
                        updateAllowedNotifications(
                            convertedAllowedNotifications as AllowedNotifications
                        );
                    } else if (
                        convertedAllowedNotifications ===
                        NotificationSettingsError.KV_PAIR_ERROR
                    ) {
                        toast.error(
                            "One of the key/value pairs is incorrect in your notification settings. Please manually add edit your notification settings via the settings menu."
                        );
                    } else if (
                        convertedAllowedNotifications ===
                        NotificationSettingsError.ROOT_KEY_ERROR
                    ) {
                        toast.error(
                            "One of the root keys is incorrect in your notification settings. Please manually add edit your notification settings via the settings menu."
                        );
                    } else if (
                        convertedAllowedNotifications ===
                        NotificationSettingsError.IMPORT_ERROR
                    ) {
                        toast.error(
                            "Unable to convert notification settings due to a parsing error. Please manually add edit your notification settings via the settings menu."
                        );
                    } else {
                        toast.error(
                            "Unable to convert notification settings due to an unknown error. Please manually add edit your notification settings via the settings menu."
                        );
                    }
                }
            }
        };

        const notifySchedule = (
            rtHour: number,
            rtMinute: number,
            rtSecond: number
        ) => {
            const title = `${shortName} - ${currentPeriod.value.name}`;
            if (rtHour === 0 && rtSecond === 0) {
                if (
                    rtMinute === 30 &&
                    !notifications.value.thirtyMinute &&
                    allowedNotifications.value.intervals.thirtyMinute
                ) {
                    notify(title, NotificationContent.THIRTY_MINUTE);
                } else if (
                    rtMinute === 15 &&
                    !notifications.value.fifteenMinute &&
                    allowedNotifications.value.intervals.fifteenMinute
                ) {
                    notify(title, NotificationContent.FIFTEEN_MINUTE);
                } else if (
                    rtMinute === 10 &&
                    !notifications.value.tenMinute &&
                    allowedNotifications.value.intervals.tenMinute
                ) {
                    notify(title, NotificationContent.TEN_MINUTE);
                } else if (
                    rtMinute === 5 &&
                    !notifications.value.fiveMinute &&
                    allowedNotifications.value.intervals.fiveMinute
                ) {
                    notify(title, NotificationContent.FIVE_MINUTE);
                } else if (
                    rtMinute === 1 &&
                    !notifications.value.oneMinute &&
                    allowedNotifications.value.intervals.oneMinute
                ) {
                    notify(title, NotificationContent.ONE_MINUTE);
                }
            } else if (
                rtHour === 0 &&
                rtMinute === 0 &&
                rtSecond === 30 &&
                !notifications.value.thirtySecond &&
                allowedNotifications.value.intervals.thirtySecond
            ) {
                notify(title, NotificationContent.THIRTY_SECOND);
            } else if (
                rtHour === 1 &&
                rtMinute === 0 &&
                rtSecond === 0 &&
                !notifications.value.oneHour &&
                allowedNotifications.value.intervals.oneHour
            ) {
                notify(title, NotificationContent.ONE_HOUR);
                notifications.value.oneHour = true;
            }
        };

        const main = () => {
            getNewTimes();
            loadDayOverride();

            if (!checkOffDay(offDays.value)) {
                offDay.value = false;

                currentPeriod.value.period = getCurrentPeriod(
                    daySchedule.value,
                    dayTime.value.splitTime || "13-05-00"
                );

                if (currentPeriod.value.period) {
                    currentPeriod.value.name = checkForCustomPeriodName(
                        currentPeriod.value.period.name,
                        periodNames.value,
                        true
                    );

                    periodDifferences.value.different =
                        currentPeriod.value.period.name ===
                        periodDifferences.value.previousName;
                    periodDifferences.value.previousName =
                        currentPeriod.value.period.name;

                    if (currentPeriod.value.period.times) {
                        nextPeriod.value.period = getNextPeriod(
                            daySchedule.value,
                            currentPeriod.value.period.times.end || "13-05-00"
                        );
                        if (nextPeriod.value.period) {
                            nextPeriod.value.name = checkForCustomPeriodName(
                                nextPeriod.value.period.name,
                                periodNames.value,
                                true
                            );

                            if (nextPeriod.value.period.times) {
                                nextPeriod.value.startTime = hourConversion(
                                    twentyFourHourStatus.value
                                        ? HourConversionType.TwentyFourHour
                                        : HourConversionType.TwelveHour,
                                    nextPeriod.value.period.times.start
                                );
                            } else {
                                nextPeriod.value.period = null;
                            }
                        } else {
                            nextPeriod.value.period = null;
                        }

                        const [
                            rtHour,
                            rtMinute,
                            rtSecond,
                        ] = calculateTimeDifference(
                            dayTime.value.splitTime || "13-05-00",
                            currentPeriod.value.period.times.end || "13-05-00"
                        );
                        currentPeriod.value.remainingTime =
                            padNumber(rtHour) +
                            ":" +
                            padNumber(rtMinute) +
                            ":" +
                            padNumber(rtSecond);

                        if (periodDifferences.value.different) {
                            periodDifferences.value.different = false;

                            notifications.value.oneHour = false;
                            notifications.value.thirtyMinute = false;
                            notifications.value.fifteenMinute = false;
                            notifications.value.tenMinute = false;
                            notifications.value.fiveMinute = false;
                            notifications.value.oneMinute = false;
                            notifications.value.thirtySecond = false;
                        }

                        if (rtHour && rtMinute && rtSecond) {
                            notifySchedule(rtHour, rtMinute, rtSecond);
                        }
                    }
                }
            } else {
                offDay.value = true;
            }
        };

        onMounted(() => {
            conversion(oldKeysCheck);

            mainInterval.value = setInterval(main, 1000);

            // Tips
            periodNamesTips();

            // Notifications
            if (notificationsSupported()) {
                if (getPermission() === "default") {
                    toast.warning(
                        'To receive notifications, click "Allow" on the notification permission pop-up'
                    );

                    requestPermission();
                } else if (getPermission() !== "granted") {
                    toast.warning(
                        "To receive notifications, enable notifications for the site"
                    );
                }
            }
        });

        return {
            name,
            currentPeriod,
            nextPeriod,
            twentyFourHourStatus,
            dayTime,
            debugMode,

            prettyDateAndTime,
            overrideExpirationTime,
            offDay,

            // Functions
            toggleDebugMode,
            debugFunction,
            updatePeriodNames,
            updateAllowedNotifications,

            // Dialogs
            settingsDialog,
            timetableDialog,

            periodNamesEditDialog,
            periodNamesExportDialog,
            periodNamesImportDialog,

            notificationsEditDialog,
            notificationsExportDialog,
            notificationsImportDialog,

            periodNamesEditDialogForceRender,
            notificationsEditDialogForceRender,

            // Metadata
            scheduleId,
            schedule,
            periodNames,
            allowedNotifications,
            daySchedule,
            color,

            // Icons
            mdiConsoleLine,
            mdiCalendarOutline,
            mdiCogOutline,
        };
    },
});
</script>

<style scoped>
div.v-card {
    padding: 0 5px;
    margin: 10px 0;
    overflow-wrap: break-word;
}
</style>
