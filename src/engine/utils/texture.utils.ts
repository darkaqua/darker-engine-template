import * as PIXI from 'pixi.js';
import {Extract, MSAA_QUALITY, SCALE_MODES} from 'pixi.js';
import {Canvas} from "../canvas/canvas";

export const getClonedTexture = (texture: PIXI.Texture): Promise<PIXI.Texture> => {
    return new Promise<PIXI.Texture>(resolve => {
        const _texture = new PIXI.Texture(texture.baseTexture);
        _texture.valid = false;
        _texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
        const onLoad = () => {
            _texture.frame = new PIXI.Rectangle(
                texture.frame.x,
                texture.frame.y,
                texture.frame.width,
                texture.frame.height
            );
            _texture.valid = true;
            _texture.baseTexture.emit('load');
            resolve(_texture);
        }
        _texture.baseTexture.on('updated', onLoad);
        _texture.baseTexture.on('loaded', onLoad);
        _texture.updateUvs();
    });
}

export const getTextureFromDisplayObject = (displayObject: PIXI.DisplayObject, region: PIXI.Rectangle = displayObject.getBounds()): PIXI.Texture =>
    Canvas.getApp()?.renderer.generateTexture(displayObject, {
        region,
        multisample: MSAA_QUALITY.NONE,
        resolution: 1,
        scaleMode: SCALE_MODES.NEAREST
    });

export const getBase64FromDisplayObject = (displayObject: PIXI.DisplayObject): string =>
    (Canvas.getApp().renderer.plugins.extract as Extract).base64(displayObject);