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
