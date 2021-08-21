import { padNumber } from "../../src/constructs/calculations";
import { generateNotFoundMessage, splice } from "../../src/constructs/strings";

describe("String Methods", () => {
    it("returns the correct padded number", () => {
        const padded = padNumber(3);
        expect(padded).toEqual("03");
    });

    it("returns the current spliced string", () => {
        const spliced = splice("1359", 2, ":");
        expect(spliced).toEqual("13:59");
    });

    it("returns the correct 404 message (schedule)", () => {
        const message = generateNotFoundMessage("/schedule/should-not-work");
        expect(message).toEqual(
            'The schedule with the ID "should-not-work" does not exist'
        );
    });

    it("returns the correct 404 message (standard)", () => {
        const message = generateNotFoundMessage("/does-not-exist");
        expect(message).toEqual("The path /does-not-exist does not exist.");
    });
});
