
type ArrayOptions = {
    from?: number;
    reversed?: boolean;
    prefix?: string;
    suffix?: string;
}

export const getArray = <T extends (string | number)>(length: number, options?: ArrayOptions): T[] => {
    const {
        prefix,
        suffix,
        reversed,
        from
    }: ArrayOptions = {
        from: 0,
        reversed: false,
        ...options,
    }
    
    const array = Array.from({ length })
        .fill(null)
        .map((_, i) => from + i)
        .map((num) => suffix !== undefined ? `${num}${suffix}` : num)
        .map((num) => prefix !== undefined ? `${prefix}${num}` : num)
    ;
    return (reversed ? array.reverse() : array) as any;
}