import {
    calculateTimeDifference,
    hourConversion,
} from "../../src/constructs/calculations";

import { HourConversionType } from "../../src/models/calculations";

describe("Time Calculations", () => {
    it("returns the correct time difference", () => {
        const firstTime = "11-00-00",
            secondTime = "11-10-00";

        const timeDifference = calculateTimeDifference(firstTime, secondTime);
        expect(timeDifference).toEqual([0, 10, 0]);
    });

    it("returns the correct 12-hour conversion", () => {
        const conversion = hourConversion(
            HourConversionType.TwelveHour,
            "13-04-20"
        );

        expect(conversion).toEqual("1:04 PM");
    });

    it("returns the correct 24-hour conversion", () => {
        const conversion = hourConversion(
            HourConversionType.TwentyFourHour,
            "08-25-00"
        );

        expect(conversion).toEqual("08:25");
    });
});
