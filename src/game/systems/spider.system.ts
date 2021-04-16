import {SystemFunction} from "darker-engine";
import * as PIXI from "pixi.js";
import {ComponentEnum} from "../component.enum";
import {getRandomNumber} from "../../utils/number.utils";
import {spiderEntity} from "../entities/spider.entity";
import {app, game} from "../../index";

export const spiderSystem: SystemFunction<ComponentEnum> = (
    {
        getEntityList
    }
) => {

    setTimeout(() => {
        game.addEntity(spiderEntity('Spidy'));
    }, 300);

    const getSprite = (id: string): PIXI.Sprite => app.stage.getChildByName(id) as PIXI.Sprite;

    const onAdd = (id: string) => {
        const sprite = getSprite(id);
        const entity = game.getEntity(id);

        sprite.interactive = true;
        sprite.on('pointertap', () => {
            console.log('mousedown', id);
            entity.removeComponent(ComponentEnum.SPIDY);
        });

        const text = new PIXI.Text(id);
        text.name = 'text';
        text.position.y = 100;
        sprite.addChild(text);

        entity.updateComponent(ComponentEnum.SPIDY, {
            deathMessage: 'Mr. Stark? I don\'t feel so good... I don\'t wanna go...',
            velocity: getRandomNumber(1, 50)
        });
    }

    const onRemove = (id: string) => {
        const { deathMessage } = game.getEntity(id).getComponent(ComponentEnum.SPIDY);
        const sprite = getSprite(id);
        const spriteText = sprite.getChildByName('text') as PIXI.Text;
        spriteText.text = deathMessage;

        setTimeout(() => {
            game.removeEntity(id);
            game.addEntity( spiderEntity('Spider_' + getRandomNumber(1, 9999999)) );
        }, 2000);
    }

    const onLoop = (delta: number) => {
        getEntityList().forEach(entityId => {
            const sprite = app.stage.getChildByName(entityId);
            const { velocity } = game.getEntity(entityId).getComponent(ComponentEnum.SPIDY);
            sprite.position.x += delta * (velocity / 10);
        });
    }

    app.ticker.add(onLoop);

    return {
        components: [
            ComponentEnum.SPIDY,
            ComponentEnum.MOB
        ],
        onAdd,
        onRemove
    }
}
