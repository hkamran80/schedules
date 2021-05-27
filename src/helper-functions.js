export const days = {
    SUN: "Sunday",
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday"
};

export function padNumber(number) {
    return Number(number < 10)
        ? "0" + Number(number).toString()
        : Number(number).toString();
}

export function calculateTimeDifference(firstTime, secondTime) {
    let firstTimeString = firstTime.replaceAll("-", ":"),
        secondTimeString = secondTime.replaceAll("-", ":");

    let startTime = new Date("1970-01-01 " + firstTimeString),
        endTime = new Date("1970-01-01 " + secondTimeString);
    let millisecondDifference = endTime - startTime;

    let seconds = millisecondDifference / 1000;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = seconds % 60;

    // Percentage remaining: (startTime / endTime) * 100)

    return [hours, minutes, seconds];
}

export function shortenedDayStringToLong(shortenedDay) {
    return days[shortenedDay] || null;
}

export function getShortDay() {
    return new Date()
        .toLocaleDateString("en-us", { weekday: "short" })
        .toUpperCase();
}

export function encodeHTML(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
}

export function hourConversion(toHourType, time) {
    let timeSplit = time.split("-");

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

    if (toHourType === "12-hour") {
        let hourEnding;
        if (hours >= 13) {
            hours -= 12;
            hourEnding = "PM";
        } else {
            hourEnding = "AM";
        }

        return `${hours}:${padNumber(minutes)} ${hourEnding}`;
    } else {
        return `${hours}:${padNumber(minutes)}`;
    }
}

export function getDate() {
    let d = new Date();
    return (
        d.getFullYear() +
        "-" +
        padNumber(d.getMonth() + 1) +
        "-" +
        padNumber(d.getDate())
    );
}
