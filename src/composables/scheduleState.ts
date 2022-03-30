import { ref } from "vue";
import { useTimer } from "vue-timer-hook";

export const timer = useTimer();
export const scheduleId = ref<string | null>(null);
export const scheduleShortName = ref<string | null>(null);
