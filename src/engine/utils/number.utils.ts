import {getArray} from "./array.utils";

export const getRandomNumberBetween = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min)


export const getRandomNumber = (length: number): number =>
    parseInt(getArray<number>(length).reduce((obj) => `${obj}${getRandomNumberBetween(0, 9)}`, ''))

export const getSeedRandomNumber = (seed: string) => {
    let h = 1779033703 ^ seed.length;
    
    for(let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        
        const randomNumber = (h ^= h >>> 16) >>> 0;
        
        return randomNumber / Math.pow(10, `${randomNumber}`.length);
    }
}