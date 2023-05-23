import { convertToTimezoneOffsetISOString } from "@hkamran/utility-datetime";

export const fixOffsetTime = (time: string): string => {
    const [hour, minute, second] = time.split(":");

    const baseTime = `${hour}:${minute}`;

    const secondNumber = parseInt(second);
    if (secondNumber >= 30) {
        const originalTime = new Date(
            convertToTimezoneOffsetISOString(new Date()).replace(
                /\d{2}:\d{2}:\d{2}/g,
                time,
            ),
        );
        const modifiedTime = new Date(
            originalTime.getTime() + 60000 - secondNumber * 1000,
        );

        const correctedDate = convertToTimezoneOffsetISOString(modifiedTime);
        const match = correctedDate.match(/\d{2}:\d{2}/g);
        if (match && match.length > 0) {
            return match[0];
        }

        return baseTime;
    }

    return baseTime;
};
