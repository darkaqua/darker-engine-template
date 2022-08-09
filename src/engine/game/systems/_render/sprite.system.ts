import {SystemFunction} from "darker-engine";
import * as PIXI from "pixi.js";
import {Game} from "../../game";
import {displayObjectSystem} from "./_displayObject.system";
import {Component} from "../../component.const";
import {SpriteComponent} from "../../components/sprite.component";
import {isNullOrUndefined} from "../../../utils/random.utils";
import {SpriteSheets} from "../../../sprite-sheets/sprite-sheets";

export const spriteSystem: SystemFunction = () => {

    const { addDisplayObject, removeDisplayObject, getDisplayObject } = displayObjectSystem();

    const _getTexture = (id: string) => {
        const entity = Game.getEntity(id);
        const { name, spriteSheet } = entity.getComponent<SpriteComponent>(Component.SPRITE);

        let _texture;
        // if(texture)
        //     _texture = Spritesheets.getTexture(texture);
        if(spriteSheet)
            _texture = SpriteSheets.get(spriteSheet).textures[name];

        // if(!_texture)
        //     throw `${entity.id} has no valid texture!`
        //         + `\n[name:${name}, texture:${texture}, spriteSheet:${spriteSheet}]`
        //         + `\n[components:${entity.components.join(',')}]`
        return _texture
    }
    
    const onAdd = (id: string) => {
        const entity = Game.getEntity(id);
        const { alpha, renderable } = entity.getComponent<SpriteComponent>(Component.SPRITE);

        const texture = _getTexture(id);

        const sprite = new PIXI.Sprite(texture);
        sprite.renderable = renderable === undefined ? true : renderable;
        sprite.name = id;
        addDisplayObject(sprite);

        if(!isNullOrUndefined(alpha))
            sprite.alpha = alpha;
    }
    
    const onUpdateSprite = (id: string) => {
        const entity = Game.getEntity(id);
        const { alpha, renderable } = entity.getComponent<SpriteComponent>(Component.SPRITE);

        const sprite = getDisplayObject(id) as PIXI.Sprite;
        sprite.renderable = renderable === undefined ? true : renderable

        const texture = _getTexture(id);

        sprite.texture = texture || sprite.texture;

        if(!isNullOrUndefined(alpha))
            sprite.alpha = alpha;
    }
    
    const onUpdate = (id: string, component: string) => {
        if(component === Component.SPRITE)
            return onUpdateSprite(id);
    }

    const onRemove = (id: string) => {
        removeDisplayObject(id);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.SPRITE
        ],
        onAdd,
        onUpdate,
        onRemove
    }
};
