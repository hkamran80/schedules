import { ScheduleTimes, TimetablePeriod } from "@/structures/schedule";
import { getISODate } from "@/constructs/datetime";
import { checkForCustomPeriodName } from "@/constructs/periods";
import { PeriodNames } from "@/structures/periods";

export function getTimetablePeriods(
    schedule: ScheduleTimes,
    currentPeriodNames: PeriodNames,
    color: string,
    withPeriod = false
) {
    let periods = [] as TimetablePeriod[];

    if (typeof schedule !== "undefined") {
        const date = getISODate();

        periods = Object.keys(schedule).map((period) => {
            return {
                name: checkForCustomPeriodName(
                    period,
                    currentPeriodNames,
                    withPeriod
                ),
                start: `${date} ${schedule[period][0].replaceAll("-", ":")}`,
                end: `${date} ${schedule[period][1].replaceAll("-", ":")}`,
                color: period.indexOf("Passing") === -1 ? color : "primary",
            };
        });
    }

    return periods;
}
