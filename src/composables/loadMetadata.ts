import { Schedule, ScheduleMetadata } from "@/models/schedule";
import { computed } from "@vue/composition-api";

export function loadMetadata(
    scheduleId: string,
    schedules: Schedule
): ScheduleMetadata {
    const currentSchedule = schedules[scheduleId];

    const name = currentSchedule.name;
    const shortName = currentSchedule.shortName;
    const schedule = computed(() => currentSchedule.schedule);
    const color = computed(() => currentSchedule.color);
    const icon = computed(() => currentSchedule.icon);
    const offDays = computed(() => currentSchedule.offDays);

    return { name, shortName, schedule, color, icon, offDays };
}
