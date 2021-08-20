import { padNumber } from "../../src/constructs/calculations";
import { splice } from "../../src/constructs/strings";

describe("String Methods", () => {
    it("returns the correct padded number", () => {
        const padded = padNumber(3);
        expect(padded).toEqual("03");
    });

    it("returns the current spliced string", () => {
        const spliced = splice("1359", 2, ":");
        expect(spliced).toEqual("13:59");
    });
});
