import {SpriteSheet as SpriteSheetType} from "./sprite-sheets.types";
import {SpriteSheetEnum} from "./sprite-sheets.enum";
import {getArray} from "../utils/array.utils";

export const SpriteSheetRecord: Record<SpriteSheetEnum, SpriteSheetType> = {
    FONT: {
        path: 'font/',
        type: 'default'
    },
    PLAYER: {
        path: 'player',
        type: 'list',
        animations: {
            north_idle: getArray(1, { prefix: 'N_', from: 0 }),
            south_idle: getArray(1, { prefix: 'S_', from: 0 }),
            east_idle: getArray(1, { prefix: 'E_', from: 0 }),
            west_idle: getArray(1, { prefix: 'W_', from: 0 }),
            
            north_walk: getArray(23, { prefix: 'N_', from: 1 }),
            south_walk: getArray(23, { prefix: 'S_', from: 1 }),
            east_walk: getArray(23, { prefix: 'E_', from: 1 }),
            west_walk: getArray(23, { prefix: 'W_', from: 1 }),
        }
    }
};