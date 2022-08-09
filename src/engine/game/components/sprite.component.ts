import {SpriteSheetEnum} from "../../sprite-sheets/sprite-sheets.enum";

export type SpriteComponent = {
    renderable?: boolean;
    // Options:

    // // #1 - Single texture
    // texture?: string;

    // #2 - Texture from spriteSheet
    spriteSheet?: SpriteSheetEnum;
    name?: string;

    // Optional
    alpha?: number;
}
