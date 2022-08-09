import {EntityType} from "darker-engine/build/types";
import {Component} from "../../component.const";
import {PivotComponent} from "../../components/pivot.component";
import {MobComponent} from "../../components/_experimental/mob.component";
import {SpriteSheetEnum} from "../../../sprite-sheets/sprite-sheets.enum";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";
import {AnimatedSpriteComponent} from "../../components/animatedSprite.component";
import {v4} from "uuid";

const playerEntity = (): EntityType => ({
    _id: v4(),
    _data: {
        [Component.ANIMATED_SPRITE]: {
            spriteSheet: SpriteSheetEnum.PLAYER,
            animation: 'north_idle',
            play: false,
            animationSpeed: 0.4
        } as AnimatedSpriteComponent,
        [Component.PIVOT]: {
            y: 39,
            x: 32
        } as PivotComponent,
        [Component.MOB]: {
            follow: true
        } as MobComponent,
        [Component.ISOMETRIC_POSITION]: {
            x: 0,
            y: 0,
            z: 0,
            zIndex: Number.MAX_SAFE_INTEGER
        } as IsometricPositionComponent
    },
    _components: [
        Component.DISPLAY_OBJECT,
        Component.ANIMATED_SPRITE,
        Component.PIVOT,
        Component.POSITION,
        Component.ISOMETRIC_POSITION,
        Component.MOB,
        Component.GAME_STAGE,
    ],
});

export const PLAYER = playerEntity();