<script setup lang="ts">
import feather from "feather-icons";
import {
    allowedNotifications,
    hour24,
    periodNames,
} from "../composables/storage";

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    SwitchGroup,
    Switch,
    SwitchLabel,
} from "@headlessui/vue";
import { computed, ref, watchEffect } from "vue";
import {
    useClipboard,
    usePermission,
    useStorage,
    useTimeoutFn,
    watchOnce,
    type RemovableRef,
} from "@vueuse/core";
import { scheduleId } from "../composables/scheduleState";
import { generateSchedulePeriods } from "../composables/periods";
import { ScheduleDays } from "../types/schedule";

const props = defineProps<{
    show: boolean;
    schedule: ScheduleDays;
}>();
const emit = defineEmits<{
    (e: "hide"): void;
    (e: "editNotifications"): void;
    (e: "editPeriodNames"): void;
}>();

const notificationsEnabledModel = ref<boolean>(false);
let notificationsEnabled: RemovableRef<boolean> | null = null;

if (scheduleId.value) {
    notificationsEnabled = useStorage(
        `schedule.${scheduleId.value}.notifications`,
        true,
    );
    notificationsEnabledModel.value = notificationsEnabled.value;
} else {
    watchOnce(scheduleId, (newScheduleId) => {
        notificationsEnabled = useStorage(
            `schedule.${newScheduleId}.notifications`,
            true,
        );
        notificationsEnabledModel.value = notificationsEnabled.value;
    });
}

const settingsImported = ref<boolean>(false);
const settingsImport = async () => {
    if (!settingsImported.value) {
        const rawSettings = await readClipboard();
        if (rawSettings) {
            try {
                const settings = JSON.parse(rawSettings);

                if (
                    "hour24" in settings &&
                    typeof settings.hour24 === "boolean"
                ) {
                    hour24.value = settings.hour24;
                }

                if (
                    "notifications" in settings &&
                    typeof settings.notifications === "boolean"
                ) {
                    notificationsEnabledModel.value = settings.notifications;
                }

                if (
                    "periodNames" in settings &&
                    typeof settings.periodNames === "object" &&
                    props.schedule &&
                    periodNames
                ) {
                    let importPeriods = Object.keys(
                        settings.periodNames,
                    ).sort();
                    let schedulePeriods = Array.from(
                        new Set(
                            Object.values(props.schedule)
                                .flatMap((day) => generateSchedulePeriods(day))
                                .filter(({ allowEditing }) => !!allowEditing)
                                .map(({ originalName }) => originalName)
                                .sort(),
                        ),
                    );

                    if (importPeriods.join(",") === schedulePeriods.join(",")) {
                        // TODO: Fix period names order
                        periodNames.value = Object.fromEntries(
                            schedulePeriods.map((periodName) => [
                                periodName,
                                settings.periodNames[periodName as string],
                            ]),
                        );
                    }
                }

                settingsImported.value = true;
                if (fallbackClipboardRead.value) {
                    fallbackClipboardRead.value = false;
                }

                useTimeoutFn(() => (settingsImported.value = false), 1500, {
                    immediate: true,
                });
            } catch {
                console.error("An error occurred while loading settings");
            }
        }
    }
};

const readClipboard = async () => {
    try {
        return await navigator.clipboard.readText();
    } catch (error) {
        console.error(error);

        if (fallbackClipboardRead.value === false) {
            fallbackClipboardRead.value = true;
            return null;
        } else {
            if (fallbackClipboardContent.value.trim()) {
                return fallbackClipboardContent.value;
            }
        }
    }
};

const settingsExport = computed(() =>
    JSON.stringify({
        hour24: hour24.value,
        periodNames: periodNames ? periodNames.value : null,
        notifications: notificationsEnabledModel.value,
        allowedNotifications:
            allowedNotifications && allowedNotifications.value
                ? allowedNotifications.value
                : null,
    }),
);

const { isSupported: clipboardSupported, copy, copied } = useClipboard();
const writePermission = usePermission("clipboard-write");

const fallbackClipboardRead = ref<boolean>(false);
const fallbackClipboardContent = ref<string>("");

watchEffect(() => {
    if (notificationsEnabled && notificationsEnabledModel.value) {
        notificationsEnabled.value = notificationsEnabledModel.value;
    }
});
</script>

<template>
    <TransitionRoot appear :show="props.show" as="template">
        <Dialog as="div" @close="emit('hide')">
            <div
                class="fixed inset-0 z-10 overflow-clip bg-black bg-opacity-60"
            >
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <TransitionChild
                        as="span"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="inline-block w-full max-w-md max-h-256 p-6 my-8 overflow-none text-left align-middle transition-all transform bg-white dark:bg-black shadow-xl rounded-lg"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-black flex space-x-3 items-center pb-2"
                            >
                                <span class="flex-1"> Settings </span>

                                <button
                                    v-if="clipboardSupported"
                                    type="button"
                                    class="focus:outline-none transition-colors ease-in-out duration-200"
                                    :class="{
                                        'text-green-600': settingsImported,
                                    }"
                                    :disabled="settingsImported"
                                    @click="settingsImport"
                                    v-html="feather.icons.download.toSvg()"
                                />

                                <button
                                    v-if="
                                        writePermission !== 'denied' &&
                                        clipboardSupported
                                    "
                                    type="button"
                                    :class="{ 'text-green-600': copied }"
                                    class="focus:outline-none transition-colors ease-in-out duration-200"
                                    :disabled="copied"
                                    @click="copy(settingsExport)"
                                    v-html="feather.icons.upload.toSvg()"
                                />

                                <button
                                    type="button"
                                    class="focus:outline-none"
                                    @click="emit('hide')"
                                    v-html="feather.icons.x.toSvg()"
                                />
                            </DialogTitle>

                            <div
                                class="mt-4 max-h-128 overflow-y-auto space-y-4"
                            >
                                <div
                                    v-if="fallbackClipboardRead"
                                    class="space-y-2"
                                >
                                    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
                                    <label
                                        for="clipboard-read-fallback"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Import Settings
                                    </label>
                                    <textarea
                                        id="clipboard-read-fallback"
                                        v-model="fallbackClipboardContent"
                                        class="rounded-lg w-full text-xs dark:text-white dark:bg-black ring-inset ring-2 ring-gray-200 dark:ring-gray-800 focus:outline-none focus:ring-pink-700 dark:focus:ring-pink-500 py-4 px-4 resize-y"
                                        placeholder="Settings"
                                        autocomplete="off"
                                        autocapitalize="none"
                                        autocorrect="off"
                                        spellcheck="false"
                                        rows="10"
                                    ></textarea>

                                    <button
                                        type="button"
                                        class="w-full text-left px-4 py-2 ring-2 ring-gray-200 dark:ring-gray-800 ring-inset hover:bg-gray-200 dark:hover:bg-gray-800 disabled:hover:bg-white disabled:dark:hover:bg-black transition rounded-lg text-black dark:text-white"
                                        :disabled="
                                            !fallbackClipboardContent.trim()
                                        "
                                        @click="settingsImport"
                                    >
                                        Import
                                    </button>

                                    <p
                                        class="text-gray-500 text-xs leading-normal"
                                    >
                                        Your browser doesn't support reading the
                                        clipboard, so you have to paste your
                                        settings into the text field above.
                                    </p>
                                </div>

                                <SwitchGroup>
                                    <div class="flex items-center">
                                        <SwitchLabel
                                            class="mr-4 flex-1 text-black dark:text-white"
                                        >
                                            24-hour time
                                        </SwitchLabel>
                                        <Switch
                                            v-model="hour24"
                                            :class="
                                                hour24
                                                    ? 'bg-pink-700 dark:bg-pink-500'
                                                    : 'bg-gray-200 dark:bg-ut-grey'
                                            "
                                            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none"
                                        >
                                            <span
                                                :class="
                                                    hour24
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                "
                                                class="inline-block w-4 h-4 transition-transform transform bg-white dark:bg-gray-200 rounded-full"
                                            />
                                        </Switch>
                                    </div>
                                </SwitchGroup>

                                <SwitchGroup
                                    v-if="notificationsEnabled !== null"
                                >
                                    <div class="flex items-center">
                                        <SwitchLabel
                                            class="mr-4 flex-1 text-black dark:text-white"
                                        >
                                            Enable Notifications
                                        </SwitchLabel>
                                        <Switch
                                            v-model="notificationsEnabledModel"
                                            :class="
                                                notificationsEnabledModel
                                                    ? 'bg-pink-700 dark:bg-pink-500'
                                                    : 'bg-gray-200 dark:bg-ut-grey'
                                            "
                                            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none"
                                        >
                                            <span
                                                :class="
                                                    notificationsEnabledModel
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                "
                                                class="inline-block w-4 h-4 transition-transform transform bg-white dark:bg-gray-200 rounded-full"
                                            />
                                        </Switch>
                                    </div>
                                </SwitchGroup>

                                <button
                                    type="button"
                                    class="w-full text-left px-4 py-2 ring-2 ring-gray-200 dark:ring-gray-800 ring-inset hover:bg-gray-200 dark:hover:bg-gray-800 transition rounded-lg text-black dark:text-white"
                                    @click="emit('editNotifications')"
                                >
                                    Edit Notifications
                                </button>

                                <button
                                    type="button"
                                    class="w-full text-left px-4 py-2 ring-2 ring-gray-200 dark:ring-gray-800 ring-inset hover:bg-gray-200 dark:hover:bg-gray-800 transition rounded-lg text-black dark:text-white"
                                    @click="emit('editPeriodNames')"
                                >
                                    Edit Period Names
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
