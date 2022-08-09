import {getArray} from "./array.utils";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

export const getRandomString = (length: number, numbers: boolean = true): string => {
    const charList = numbers ? CHARACTERS + NUMBERS : CHARACTERS;
    return getArray<string>(length)
        .reduce((text) => `${text}${charList.charAt(Math.floor(Math.random() * charList.length))}`, '')
}