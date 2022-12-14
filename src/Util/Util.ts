export function delayFor(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}