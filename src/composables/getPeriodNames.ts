import { loadPeriodNames } from "@/constructs/periods";
import { PeriodNames } from "@/structures/periods";
import { ScheduleDays } from "@/structures/schedule";

export function getPeriodNames(
    scheduleId: string,
    schedule: ScheduleDays
): PeriodNames {
    const periodNames = loadPeriodNames(
        {} as PeriodNames,
        scheduleId,
        schedule
    );

    return periodNames ? periodNames : ({} as PeriodNames);
}
