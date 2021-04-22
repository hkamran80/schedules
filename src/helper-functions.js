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

    return [hours, minutes, seconds];
}
