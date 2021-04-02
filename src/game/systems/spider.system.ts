import {SystemFunction} from "darker-engine";
import * as PIXI from "pixi.js";
import {SystemEnum} from "../system.enum";
import {ComponentEnum} from "../component.enum";
import {getRandomNumber} from "../../utils/number.utils";
import {spiderEntity} from "../entities/spider.entity";
import {app, game} from "../../index";

export const spiderSystem: SystemFunction<SystemEnum, ComponentEnum> = (
    {
        getGame,
        getEntityList
    }
) => {
    setTimeout(() => {
        game.entities.add(spiderEntity('Spidy'));
    }, 300);

    const getSprite = (id: string): PIXI.Sprite => app.stage.getChildByName(id) as PIXI.Sprite;

    const onAdd = (id: string) => {
        const sprite = getSprite(id);
        sprite.interactive = true;
        sprite.on('mousedown', () => {
            console.log('mousedown', id);
            entity.removeComponent(ComponentEnum.SPIDY);
        });

        const text = new PIXI.Text(id);
        text.position.y = 100;
        sprite.addChild(text);

        const entity = getGame().entities.get(id);
        entity.updateComponent(ComponentEnum.SPIDY, {
            deathMessage: 'Mr. Stark? I don\'t feel so good... I don\'t wanna go...',
            velocity: getRandomNumber(1, 50)
        });
    }

    const onRemove = (id: string) => {
        const { deathMessage } = getGame().entities.get(id).getComponent(ComponentEnum.SPIDY);
        const sprite = getSprite(id);
        const spriteText = sprite.getChildAt(0) as PIXI.Text;
        spriteText.text = deathMessage;

        setTimeout(() => {
            getGame().entities.get(id).removeComponent(ComponentEnum.SPRITE);
            getGame().entities.add( spiderEntity('Spider_' + getRandomNumber(1, 9999999)) );
        }, 2000);
    }

    const onLoop = (delta: number) => {
        getEntityList().forEach(entityId => {
            const sprite = app.stage.getChildByName(entityId);
            const { velocity } = getGame().entities.get(entityId).getComponent(ComponentEnum.SPIDY);
            sprite.position.x += delta * (velocity / 10);
        });
    }

    return {
        id: SystemEnum.SPIDER_SYSTEM,
        components: [
            ComponentEnum.SPIDY,
            ComponentEnum.MOB
        ],
        onAdd,
        onRemove,
        onLoop
    }
}
