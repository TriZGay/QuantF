export function isNullAndUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) && isNull(val);
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val);
}
