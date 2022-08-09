import * as PIXI from "pixi.js";
import {Color} from "../../enums/colors.enum";
import {SpriteSheets} from "../../sprite-sheets/sprite-sheets";
import {SpriteSheetEnum} from "../../sprite-sheets/sprite-sheets.enum";
import {Position} from "../types/generics.types";
import {getGraphicsRectangle} from "../../utils/graphics.utils";
import {getTextureFromDisplayObject} from "../../utils/texture.utils";

export type TextUIType = {
    setText: (text: string, config?: TextConfig) => any;
    getText: () => string;
    refresh: () => any;
    setConfig: (config: TextConfig) => any;
    getContainer: () => PIXI.Container;
    destroy: () => any;
}

export type TextConfig = {
    color?: Color;
    visible?: boolean;
    type?: 'normal' | 'thicc' | 'bold';
    backgroundColor?: Color;
    backgroundOpacity?: number;
    shadowColor?: Color;
    shadowOpacity?: number;
    shadowDrop?: Position;
    padding?: number[];
    align?: 'right' | 'center';
    hoverColor?: Color;
    hoverBackgroundColor?: Color;
}

export const defaultTextConfig = (
    config: TextConfig = {}
): TextConfig => ({
    color: Color.WHITE,
    visible: true,
    type: 'normal',
    backgroundOpacity: 1,
    padding: [],
    align: 'right',
    ...config,
});

export const textDisplayObject = (
    text: string,
    config: TextConfig = {}
): TextUIType => {
    let _text = text;
    let _config: TextConfig = defaultTextConfig(config);
    let _unalteredConfig: TextConfig = {..._config};
    
    let _generatedTexture: PIXI.Texture;
    let _generatedContainer: PIXI.Container;
    
    const container = new PIXI.Container();
    container.interactive = true;
    container.on('mouseover', () => {
        const isHoverColorUndefined = _unalteredConfig.hoverColor === undefined;
        if(!isHoverColorUndefined)
            setConfig({
                color: _unalteredConfig.hoverColor,
            }, true);

        const isBackgroundHoverColorUndefined = _unalteredConfig.hoverBackgroundColor === undefined;
            if(!isBackgroundHoverColorUndefined)
                setConfig({
                    backgroundColor: _unalteredConfig.hoverBackgroundColor,
                }, true);
    });
    container.on('mouseout', () => {
        const isColorAltered = _unalteredConfig.color !== _config.color;
        if(isColorAltered)
            setConfig({
                color: _unalteredConfig.color,
            }, true);

        const isBackgroundColorAltered = _unalteredConfig.backgroundColor !== _config.backgroundColor;

        if(isBackgroundColorAltered)
            setConfig({
                backgroundColor: _unalteredConfig.backgroundColor,
            }, true);
    });
    
    const bottomTextMargin = 2;
    
    const _render = () => {
        // container.children[0]?.destroy({ children: true, texture: true, baseTexture: true })
        _generatedTexture?.destroy(true);
        _generatedContainer?.destroy({ children: true, texture: false, baseTexture: true });
        container.removeChildren();
        container.alpha = _config.visible ? 1 : 0;
        // _generatedContainer?.destroy();
        
        _generatedContainer = new PIXI.Container();

        if(!_text) return;
        
        const textArray = _text.split('');
        const charContainer = new PIXI.Container();
        
        const renderCharParticleContainer = (
            tint?: Color,
            opacity?: number,
            position?: Position
        ) => {
            if(tint === undefined || opacity === undefined || opacity === 0) return;
            
            const charParticleContainer = new PIXI.ParticleContainer(textArray.length);
            
            let totalPositionX = 0;
            
            const charSpriteList = textArray.map((char, index) => {
                const charTextureName = `${_config.type}_${char}`;
                const charTexture = SpriteSheets.get(SpriteSheetEnum.FONT).textures[charTextureName];
                
                const sprite = new PIXI.Sprite(charTexture);
                sprite.position.x = totalPositionX;
                totalPositionX += charTexture.frame.width + 1;
                
                sprite.getBounds();
                
                return sprite;
            });
            
            charParticleContainer.addChild(...charSpriteList);
            charParticleContainer.tint = tint;
            charParticleContainer.alpha = opacity;
            
            charParticleContainer.position.x = (_config.padding[0] || 0) + (position?.x || 0);
            charParticleContainer.position.y = (_config.padding[1] || 0) + (position?.y || 0);
            
            charContainer.addChild(charParticleContainer);
        }
        renderCharParticleContainer(_config?.shadowColor, _config.shadowOpacity, _config.shadowDrop);
        renderCharParticleContainer(_config.color, 1);
        
        const { width, height } = charContainer.getBounds();
        
        const backgroundSprite = getGraphicsRectangle(
            {
                width: width + (_config.padding[0] || 0) + (_config.padding[2] || 0),
                height: height + (_config.padding[1] || 0) + (_config.padding[3] || 0) - bottomTextMargin
            },
            _config.backgroundColor,
            _config.backgroundOpacity || 0
        );
        
        _generatedContainer.addChild(backgroundSprite, charContainer);
        _generatedTexture = getTextureFromDisplayObject(_generatedContainer, _generatedContainer.getBounds());
    
        charContainer.destroy({ children: true });
        backgroundSprite.destroy();
        
        container.addChild(new PIXI.Sprite(_generatedTexture));

        const { width: containerWidth, height: containerHeight } = container.getBounds();

        if(_config.align === 'center')
            container.pivot.set(Math.round(containerWidth / 2), Math.round(containerHeight / 2));
        
        container.zIndex = Number.MAX_SAFE_INTEGER;
    }
    
    _render();
    
    const setText = (text: string, config: TextConfig) => {
        _text = text;
        setConfig(config);
    }
    
    const getText = (): string => _text;
    
    const setConfig = (config: TextConfig, preserveHover = false) => {
        _config = {
            ..._config,
            ...config
        };
        if(!preserveHover)
            _unalteredConfig = { ..._config };
        _render();
    }
    
    const refresh = () => _render();
    
    const getContainer = (): PIXI.Container => container;
    
    const destroy = () => {
        _generatedTexture?.destroy(true);
        _generatedContainer?.destroy({ children: true, texture: false, baseTexture: true });
        container.destroy(true)
    }
    
    return {
        setText,
        getText,
        setConfig,
        refresh,
        getContainer,
        destroy
    }
};
