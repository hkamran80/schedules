import { Schedule } from "@/structures/schedule";
import { computed } from "@vue/composition-api";

export function loadMetadata(scheduleId: string, schedules: Schedule): any {
    const currentSchedule = schedules[scheduleId];

    const name = currentSchedule.name;
    const shortName = currentSchedule.shortName;
    const schedule = computed(() => currentSchedule.schedule);
    const color = computed(() => currentSchedule.color);
    const icon = computed(() => currentSchedule.icon);

    return { name, shortName, schedule, color, icon };
}
