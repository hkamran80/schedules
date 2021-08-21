export function splice(
    originalText: string,
    offset: number,
    insertText: string,
    removeCount = 0
) {
    const calculatedOffset = offset < 0 ? originalText.length + offset : offset;
    return (
        originalText.substring(0, calculatedOffset) +
        insertText +
        originalText.substring(calculatedOffset + removeCount)
    );
}

export function generateNotFoundMessage(queryParameter: string): string {
    if (queryParameter.indexOf("/schedule/") !== -1) {
        return `The schedule with the ID "${queryParameter.replace(
            "/schedule/",
            ""
        )}" does not exist`;
    }

    return `The path ${queryParameter} does not exist.`;
}
