import { RemovableRef, useStorage } from "@vueuse/core";
import { ref, watchEffect } from "vue";
import { useTimer } from "vue-timer-hook";
import { PeriodNames } from "../types/periods";
import { emptyPeriodNames } from "./storage";

export const timer = useTimer();
export const scheduleId = ref<string | null>(null);
export const scheduleShortName = ref<string | null>(null);
export let periodNames: RemovableRef<PeriodNames | null> | null = null;

watchEffect(() => {
    if (scheduleId.value) {
        periodNames = useStorage(
            `schedule.${scheduleId.value}.periodNames`,
            emptyPeriodNames.value,
        );
    }
});
