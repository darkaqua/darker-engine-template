
export type KeyboardType = {
    onKeyDown: (callback: (keyboardEvent: KeyboardEvent) => any) => number;
    onKeyUp: (callback: (keyboardEvent: KeyboardEvent) => any) => number;

    isFontSafe: (text: string) => boolean;

    clearKeyDown: (id: number) => void;
    clearKeyUp: (id: number) => void;
}

export const Keyboard = (): KeyboardType => {
    const fontSafeCharacters = `abcdefghijklmnopqrstuvwxyz0123456789ñç ,.;:?¿!¡@#$-_"'|%()[]`.split('');

    let _onKeyDownSubscriberList: any[] = [];
    let _onKeyUpSubscriberList: any[] = [];

    const _onKeyDown = (keyboardEvent: KeyboardEvent) => {
        if(keyboardEvent.preventDefault) keyboardEvent.preventDefault();
        _onKeyDownSubscriberList.filter(func => func !== undefined).forEach((func) => func(keyboardEvent));
    };

    const _onKeyUp = (keyboardEvent: KeyboardEvent) => {
        if(keyboardEvent.preventDefault) keyboardEvent.preventDefault();
        _onKeyUpSubscriberList.filter(func => func !== undefined).forEach((func) => func(keyboardEvent));
    };

    window.addEventListener('keydown', _onKeyDown, false);
    window.addEventListener('keyup', _onKeyUp, false);

    const onKeyDown = (callback: (keyboardEvent: KeyboardEvent) => any) => _onKeyDownSubscriberList.push(callback) - 1;
    const onKeyUp = (callback: (keyboardEvent: KeyboardEvent) => any) => _onKeyUpSubscriberList.push(callback) - 1;

    const isFontSafe = (text: string): boolean => fontSafeCharacters.indexOf(text.toLowerCase()) > -1;

    const clearKeyDown = (id: number) => _onKeyDownSubscriberList[id] = undefined;
    const clearKeyUp = (id: number) => _onKeyUpSubscriberList[id] = undefined;

    return {
        onKeyDown,
        onKeyUp,

        isFontSafe,

        clearKeyDown,
        clearKeyUp
    };
};
