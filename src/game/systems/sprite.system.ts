import {SystemFunction} from "darker-engine";
import {ComponentEnum} from "../component.enum";
import * as PIXI from "pixi.js";
import {app, game} from "../../index";

export const spriteSystem: SystemFunction = () => {
    const onAdd = (id: string) => {
        const entity = game.getEntity(id);
        const { texture } = entity.getComponent(ComponentEnum.SPRITE);
        const sprite = new PIXI.Sprite(PIXI.Texture.from(texture));
        sprite.name = id;
        app.stage.addChild(sprite);
    }

    const onRemove = (id: string) => {
        const sprite = app.stage.getChildByName(id) as PIXI.Sprite;
        app.stage.removeChild(sprite);
    }

    return {
        components: [
            ComponentEnum.SPRITE
        ],
        onAdd,
        onRemove
    }
};
