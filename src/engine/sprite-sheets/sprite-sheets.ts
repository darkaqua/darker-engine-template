import {SpriteSheetType, SpriteSheetTypeFunction} from "./sprite-sheets.types";
import {SpriteSheetRecord} from "./sprite-sheets.consts";
import * as PIXI from "pixi.js";
import {SpriteSheetEnum} from "./sprite-sheets.enum";
import {getClonedTexture} from "../utils/texture.utils";
import {performanceUtils} from "../utils/performance.utils";
import {System} from "../system/system";
import {OverlayOptions} from "sharp";
import {getPNGBase64FromBuffer} from "../utils/images.utils";
import {getBufferDataFromUrl} from "../utils/data.utils";

export const SpriteSheets = (() => {
    const spriteSheetRecord: Record<SpriteSheetEnum, PIXI.Spritesheet> = {} as any;

    function importAll(r) {
        return r.keys().reduce((object, key) => ({
            ...object,
            [/.\/(.*.)/gm.exec(key)[1]]: r(key).default || r(key)
        }), {});
    }

    const assetList = importAll((require as any).context('/assets', true, /\.(png|json)$/));
    const assetKeyList = Object.keys(assetList);

    const assetProcessMap: Record<SpriteSheetType, SpriteSheetTypeFunction> = {
        default: (resolve, { spriteSheetName, filteredAssetKeyList, animations }) => {
            const imagePath = filteredAssetKeyList.find((assetPath) => assetPath.indexOf('.png') > 0);
            const jsonPath = filteredAssetKeyList.find((assetPath) => assetPath.indexOf('.json') > 0);

            const imageAsset = assetList[imagePath];
            const jsonAsset = assetList[jsonPath];
            
            jsonAsset.animations = animations;

            const texture = PIXI.Texture.from(imageAsset);
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            const spriteSheet = new PIXI.Spritesheet(texture, jsonAsset);

            spriteSheet.parse(async () => {

                const textureKeyList = Object.keys(spriteSheet.textures);
                const targetTextureValueList = textureKeyList.map((textureName) => getClonedTexture(spriteSheet.textures[textureName]));
                const textureValueList = await Promise.all(targetTextureValueList);

                spriteSheet.textures = textureKeyList.reduce((a, b, c) => ({
                    ...a,
                    [b]: textureValueList[c]
                }), {});

                spriteSheetRecord[spriteSheetName] = spriteSheet;

                resolve();
            });
        },
        list: async (resolve, { spriteSheetName,  filteredAssetKeyList, animations }) => {
            
            const perf = performanceUtils();
            const [firstTexturePath] = filteredAssetKeyList;
            
            const sharpFirstTexture = System.sharp(await getBufferDataFromUrl(assetList[firstTexturePath]));
            const sharpFirstTextureMetadata = await sharpFirstTexture.metadata()

            const textureRectangle = {
                width: sharpFirstTextureMetadata.width,
                height: sharpFirstTextureMetadata.height
            };

            const texturePerRow = Math.ceil(Math.sqrt(filteredAssetKeyList.length));

            const spriteSize = texturePerRow * textureRectangle.width;
            const spriteSheetData: PIXI.ISpritesheetData = {
                frames: {},
                animations,
                meta: {
                    scale: "1",
                }
            }
            
            const spriteTexture = System.sharp({
                create: {
                    width: spriteSize,
                    height: spriteSize,
                    background: {
                        r: 0,
                        g: 0,
                        b: 0,
                        alpha: 0
                    },
                    channels: 4
                }
            });

            const sortedTextureKeyList = filteredAssetKeyList
                .sort((nameA, nameB) => nameA.split('_')[1] > nameB.split('_')[1] ? 1 : -1);

            const texturesMapList: Promise<OverlayOptions>[] = sortedTextureKeyList.map(async (currentTexturePath, index) => {
                const xCoordinate = (index % texturePerRow) * textureRectangle.width;
                const yCoordinate = Math.trunc(index / texturePerRow) * textureRectangle.height;
                
                const size = {
                    w: textureRectangle.width,
                    h: textureRectangle.height
                }

                const a = currentTexturePath.split('/').reverse()[0];
                const [b, c] = a.split('.')[0].split('_');
                const textureName = `${c}_${b}`;
                spriteSheetData.frames[textureName] = {
                    frame: {
                        x: xCoordinate,
                        y: yCoordinate,
                        ...size
                    },
                    sourceSize: size,
                    spriteSourceSize: {
                        x: 0,
                        y: 0,
                        ...size
                    },
                    rotated: false,
                    trimmed: false,
                }
                
                return {
                    input: await getBufferDataFromUrl(assetList[currentTexturePath]),
                    blend: 'over',
                    top: yCoordinate,
                    left: xCoordinate
                } as OverlayOptions
            });
            
            const textureCompositeList = await Promise.all(texturesMapList);
            const spriteTextureTarget = spriteTexture.composite(textureCompositeList);
            
            const buffer = await spriteTextureTarget.toFormat('png').toBuffer();
            const imageBase64 = getPNGBase64FromBuffer(buffer);
            const texture = PIXI.Texture.from(imageBase64);
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            const spriteSheet = new PIXI.Spritesheet(texture, spriteSheetData);

            spriteSheet.parse(() => {
                spriteSheetRecord[spriteSheetName] = spriteSheet;

                resolve();
                perf.end('sharp')
            });

        }
    }

    const load = async () => {
        console.log(`### Textures ###`);

        const initDate = Date.now();

        const spriteSheetKeyList = Object.keys(SpriteSheetRecord);

        console.log(`SpriteSheet (${spriteSheetKeyList.length})`);

        const promiseList = spriteSheetKeyList.map(async (spriteSheetName, index) => {
            const initSpriteSheetDate = Date.now();

            const {
                type,
                path,
                animations
            } = SpriteSheetRecord[spriteSheetName];

            const filteredAssetKeyList = assetKeyList.filter(assetName => assetName.indexOf(path) === 0);


            await new Promise((resolve) => {
                assetProcessMap[type](resolve, { spriteSheetName, path, filteredAssetKeyList, animations });
            });

            const millisecondsSpriteSheet = Date.now() - initSpriteSheetDate;

            console.log(`- SpriteSheet '${spriteSheetName}' [${type}] (${millisecondsSpriteSheet}ms)`);
        });

        await Promise.all(promiseList);

        const milliseconds = Date.now() - initDate;

        console.log(`Completed (${milliseconds}ms)!`)
        console.log(`### ######## ###`);
    }

    const get = (spriteSheet: SpriteSheetEnum): PIXI.Spritesheet => spriteSheetRecord[spriteSheet];

    return {
        load,
        get
    }

})();