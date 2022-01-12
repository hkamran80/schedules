import { SchedulePeriodTimes, TimetablePeriod } from "@/structures/schedule";
import { getISODate } from "@/constructs/datetime";
import { checkForCustomPeriodName } from "@/constructs/periods";
import { PeriodNames } from "@/structures/periods";

export function getTimetablePeriods(
    schedule: SchedulePeriodTimes,
    currentPeriodNames: PeriodNames,
    color: string,
    withPeriod = false
) {
    let periods = [] as TimetablePeriod[];

    if (typeof schedule !== "undefined") {
        const date = getISODate();

        periods = Object.keys(schedule).map((periodName) => {
            const period = schedule[periodName];
            const periodTimes = Array.isArray(period) ? period : period.times;

            return {
                name: checkForCustomPeriodName(
                    periodName,
                    currentPeriodNames,
                    withPeriod
                ),
                start: `${date} ${periodTimes[0].replaceAll("-", ":")}`,
                end: `${date} ${periodTimes[1].replaceAll("-", ":")}`,
                color:
                    periodName.indexOf("Passing") === -1 &&
                    (Array.isArray(period) || period.allowEditing)
                        ? color
                        : "primary",
            };
        });
    }

    return periods;
}
