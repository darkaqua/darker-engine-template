
export type SpriteSheet = {
    path: string;
    type: SpriteSheetType;
    animations?: Record<string, string[]>;
}

export type SpriteSheetType = 'default' | 'list';

export type SpriteSheetTypeFunctionData = {
    spriteSheetName: string,
    path: string,
    filteredAssetKeyList: string[]
    animations?: Record<string, string[]>;
}

export type SpriteSheetTypeFunction = (resolve: (value?: unknown) => void, data: SpriteSheetTypeFunctionData) => any;
