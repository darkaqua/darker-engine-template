import * as PIXI from 'pixi.js';

export type MenuType = () => MenuFunctionType;
export type MenuFunctionType = {
    onOpen: () => Promise<any>;
    onClose: () => Promise<any>;
    getContainer: () => PIXI.DisplayObject;
}