import { computed, Ref, ref } from "@vue/composition-api";

import {
    getTimes,
    getTwentyFourHourStatus,
    setTwentyFourHourStatus,
} from "@/constructs/datetime";

import { PrettyDayTime } from "@/models/datetime";
import { Nullable } from "@/models/types";

export function loadDatetime(override = false) {
    let dayTime: Ref;
    if (override) {
        dayTime = ref({
            day: null as Nullable<string>,
            time: null as Nullable<string>,
            splitTime: null as Nullable<string>,
            prettyDayTime: {
                day: null as Nullable<string>,
                time: null as Nullable<string>,
            } as PrettyDayTime,
            userOverridenDay: null as Nullable<string>,
        });
    } else {
        dayTime = ref({
            day: null as Nullable<string>,
            time: null as Nullable<string>,
            splitTime: null as Nullable<string>,
            prettyDayTime: {
                day: null as Nullable<string>,
                time: null as Nullable<string>,
            } as PrettyDayTime,
        });
    }

    const prettyDateAndTime = computed(() =>
        dayTime.value.prettyDayTime.day === null ||
        dayTime.value.prettyDayTime.time === null
            ? "One moment..."
            : `${dayTime.value.prettyDayTime.day} - ${dayTime.value.prettyDayTime.time}`
    );

    const twentyFourHourStatus = ref(getTwentyFourHourStatus());

    const getNewTimes = () => {
        twentyFourHourStatus.value = getTwentyFourHourStatus();

        const { day, time, splitTime, prettyDayTime } = getTimes(
            twentyFourHourStatus.value
        );

        dayTime.value.day = day;
        dayTime.value.time = time;
        dayTime.value.splitTime = splitTime;
        dayTime.value.prettyDayTime = prettyDayTime;
    };

    const setTFHStatus = () => {
        twentyFourHourStatus.value = !twentyFourHourStatus.value;
        setTwentyFourHourStatus(twentyFourHourStatus.value);
    };

    return {
        dayTime,
        prettyDateAndTime,
        twentyFourHourStatus,
        getNewTimes,
        setTFHStatus,
    };
}
