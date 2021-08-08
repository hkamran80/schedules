import { loadPeriodNames } from "@/constructs/periods";
import { PeriodNames } from "@/structures/periods";
import { ScheduleDays } from "@/structures/schedule";

export function getPeriodNames(
    scheduleId: string,
    schedule: ScheduleDays,
    currentPeriodNames = {} as PeriodNames
): PeriodNames {
    const periodNames = loadPeriodNames(
        currentPeriodNames,
        scheduleId,
        schedule
    );

    return periodNames ? periodNames : ({} as PeriodNames);
}
