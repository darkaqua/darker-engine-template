import * as PIXI from 'pixi.js';
import {Color} from "../enums/colors.enum";

export const getGraphicsRectangle = (
    size: PIXI.ISize,
    color: Color = Color.__PINK,
    alpha: number = 1
): PIXI.Graphics => {
    const graphics = new PIXI.Graphics();
    updateGraphicsRectangle(graphics, size, color, alpha);
    return graphics;
}

export const updateGraphicsRectangle = (
    graphics: PIXI.Graphics,
    size: PIXI.ISize,
    color: Color = Color.__PINK,
    alpha: number = 1
) => {
    graphics.clear();
    getGraphics([
        0, 0,
        size.width, 0,
        size.width, size.height,
        0, size.height
    ], color, alpha, graphics);
}

export const getGraphics = (
    polygon: number[],
    color: Color = Color.__PINK,
    alpha: number = 1,
    graphics: PIXI.Graphics = new PIXI.Graphics()
): PIXI.Graphics => {
    graphics.beginFill(color);
    graphics.alpha = color === Color.__PINK ? 0 : alpha;
    graphics.drawPolygon(polygon);
    graphics.endFill();
    return graphics;
}
