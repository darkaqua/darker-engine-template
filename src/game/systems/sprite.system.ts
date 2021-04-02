import {SystemFunction} from "darker-engine";
import {SystemEnum} from "../system.enum";
import {ComponentEnum} from "../component.enum";
import * as PIXI from "pixi.js";
import {app} from "../../index";

export const spriteSystem: SystemFunction<SystemEnum, ComponentEnum> = (
    {
        getGame
    }
) => {
    const onAdd = (id: string) => {
        const entity = getGame().entities.get(id);
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
        id: SystemEnum.SPRITE_SYSTEM,
        components: [
            ComponentEnum.SPRITE
        ],
        onAdd,
        onRemove
    }
};
