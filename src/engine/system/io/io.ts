
import {Keyboard, KeyboardType} from "./keyboard";
import {Cursor, CursorType} from "./cursor";

export type IoType = {
    keyboard: KeyboardType;
    cursor: CursorType;
}

export const Io = ((): IoType  => {

    const keyboard = Keyboard();
    const cursor = Cursor();

    return {
        keyboard,
        cursor,
    }
});