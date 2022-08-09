import * as PIXI from "pixi.js";
import {Canvas} from "../../../canvas/canvas";
import {IDestroyOptions} from "@pixi/display";

export const displayObjectSystem = () => {
    const addDisplayObject = (displayObject: PIXI.DisplayObject) => Canvas.addDisplayObject(displayObject);
    const getDisplayObject = (id: string): PIXI.DisplayObject => Canvas.getDisplayObject(id);
    const removeDisplayObject = (id: string, options?: IDestroyOptions) => Canvas.removeDisplayObject(id, options);
    
    return {
        addDisplayObject,
        getDisplayObject,
        removeDisplayObject
    }
};
