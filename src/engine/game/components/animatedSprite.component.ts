import {SpriteSheetEnum} from "../../sprite-sheets/sprite-sheets.enum";

export type AnimatedSpriteComponent = {
    spriteSheet: SpriteSheetEnum;
    animation: string;
    animationSpeed: number;
    play: boolean;
}
