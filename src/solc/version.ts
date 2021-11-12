
export function getLongVersion(fullVersion: string): string {
    return fullVersion.replace(/(soljson-)v(.*)(.js)/, "$2");
}

export function getShortVersion(longVersion: string): string {
    return longVersion.replace(/(.*)\+commit(.*)/, "$1");
}