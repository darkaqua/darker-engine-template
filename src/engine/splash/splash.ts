import {Canvas} from "../canvas/canvas";
import * as PIXI from "pixi.js";
import {Texture} from "pixi.js";

export const Splash = (() => {
    
    let splashSprite: PIXI.Sprite;
    
    const load = async () => {
        const splashTexture = await Texture.fromURL(require('/assets/splash/splash.png').default);
        splashSprite = new PIXI.Sprite(splashTexture);

        Canvas.getApp().stage.addChild(splashSprite);

        const {
            width,
            height
        } = splashSprite.getBounds();
        splashSprite.pivot.set(Math.round(width / 2), Math.round(height / 2));
    }

    const destroy = () => {
        Canvas.getApp().stage.removeChild(splashSprite);
    }

    return {
        load,
        destroy
    }
})();