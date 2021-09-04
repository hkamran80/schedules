// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValueFromObjectSearch(key: string, object: any): any | null {
    return Object.values(object)[Object.keys(object).indexOf(key)] || null;
}
