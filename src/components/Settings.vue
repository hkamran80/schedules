<script setup lang="ts">
import feather from "feather-icons";
import { hour24 } from "../composables/storage";

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
import { ref, watch } from "vue";
import { useStorage, watchOnce, type RemovableRef } from "@vueuse/core";
import { scheduleId } from "../composables/scheduleState";

const props = defineProps<{
    show: boolean;
}>();
const emit = defineEmits<{
    (e: "hide"): void;
    (e: "editNotifications"): void;
    (e: "editPeriodNames"): void;
}>();

let notificationsEnabledModel = ref<boolean>(false);
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

watch(notificationsEnabledModel, (change) => {
    if (notificationsEnabled !== null) {
        notificationsEnabled.value = change;
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
                                    type="button"
                                    class="focus:outline-none"
                                    @click="emit('hide')"
                                    v-html="feather.icons.upload.toSvg()"
                                />
                                <button
                                    type="button"
                                    class="focus:outline-none"
                                    @click="emit('hide')"
                                    v-html="feather.icons.download.toSvg()"
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
                                                    : 'bg-gray-200 dark:bg-gray-900'
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
                                                    : 'bg-gray-200 dark:bg-gray-900'
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
