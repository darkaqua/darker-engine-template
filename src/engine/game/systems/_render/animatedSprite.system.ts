import {SystemFunction} from "darker-engine";
import * as PIXI from "pixi.js";
import {displayObjectSystem} from "./_displayObject.system";
import {Component} from "../../component.const";
import {Game} from "../../game";
import {AnimatedSpriteComponent} from "../../components/animatedSprite.component";
import {SpriteSheets} from "../../../sprite-sheets/sprite-sheets";

export const animatedSpriteSystem: SystemFunction = () => {

    const { addDisplayObject, removeDisplayObject, getDisplayObject } = displayObjectSystem();

    const onAdd = (id: string) => {
        const entity = Game.getEntity(id);
        
        const {
            spriteSheet: spriteSheetEnum,
            animation,
            animationSpeed,
            play
        } = entity.getComponent<AnimatedSpriteComponent>(Component.ANIMATED_SPRITE);
    
        const spriteSheet = SpriteSheets.get(spriteSheetEnum);
        
        const animatedSprite = new PIXI.AnimatedSprite(spriteSheet.animations[animation]);
        animatedSprite.name = id;
        animatedSprite.animationSpeed = animationSpeed;

        if(play)
            animatedSprite.play();
        
        addDisplayObject(animatedSprite);
    }

    const onUpdate = (id: string, component: string) => {
        if(component !== Component.ANIMATED_SPRITE) return;

        const entity = Game.getEntity(id);

        const {
            spriteSheet: spriteSheetEnum,
            animation,
            animationSpeed,
            play
        } = entity.getComponent<AnimatedSpriteComponent>(Component.ANIMATED_SPRITE);

        const spriteSheet = SpriteSheets.get(spriteSheetEnum);


        const animatedSprite = getDisplayObject(id) as PIXI.AnimatedSprite;
        animatedSprite.textures = spriteSheet.animations[animation]

        animatedSprite.animationSpeed = animationSpeed;

        play ? animatedSprite.play() : animatedSprite.stop();
    }

    const onRemove = (id: string) => {
        removeDisplayObject(id);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.ANIMATED_SPRITE
        ],
        onAdd,
        onUpdate,
        onRemove
    }
};
