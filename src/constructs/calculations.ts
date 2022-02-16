import { HourConversionType } from "@/models/calculations";

export function padNumber(number: number | string): string {
    return Number(number < 10)
        ? "0" + Number(number).toString()
        : Number(number).toString();
}

export function calculateTimeDifference(
    firstTime: string,
    secondTime: string
): number[] {
    const firstTimeString = firstTime.replace(/-/g, ":"),
        secondTimeString = secondTime.replace(/-/g, ":");

    const startTime = new Date("01/01/2021 " + firstTimeString),
        endTime = new Date("01/01/2021 " + secondTimeString);
    const millisecondDifference = +endTime - +startTime;

    let seconds = millisecondDifference / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    // Percentage remaining: (startTime / endTime) * 100)

    return [hours, minutes, seconds];
}

export function hourConversion(
    toHourType: HourConversionType,
    time: string
): string {
    const timeSplit = time.split("-");

    let hours = Number(timeSplit[0]),
        minutes = Number(timeSplit[1]),
        seconds = Number(timeSplit[2]);

    if (seconds >= 59) {
        seconds -= 59;
        minutes += 1;
    }

    if (minutes >= 59) {
        minutes -= 59;
        hours += 1;
    }

    if (toHourType === HourConversionType.TwelveHour) {
        let hourEnding;
        if (hours >= 12) {
            if (hours >= 13) hours -= 12;
            hourEnding = "PM";
        } else {
            hourEnding = "AM";
        }

        return `${hours}:${padNumber(minutes)} ${hourEnding}`;
    } else {
        return `${padNumber(hours)}:${padNumber(minutes)}`;
    }
}
