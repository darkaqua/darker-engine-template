import {SystemFunction} from "darker-engine";
import {Canvas} from "../../../canvas/canvas";
import * as PIXI from 'pixi.js';
import {Component} from "../../component.const";
import {Game} from "../../game";
import {getGraphics, updateGraphicsRectangle} from "../../../utils/graphics.utils";
import {Color} from "../../../enums/colors.enum";
import {CAMERA_ENTITY} from "../../entities/camera.entity";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";
import {getPositionFromIsometric} from "../../../utils/position.utils";
import {AzimuthEnum} from "../../enum/orientation.enum";
import {displayObjectSystem} from "./_displayObject.system";

export const gameStageSystem: SystemFunction = () => {

    const { addDisplayObject, removeDisplayObject } = displayObjectSystem();

    let gameStage: PIXI.Graphics;
    let gameStageContainer: PIXI.Container;

    let onResizeId: number;
    let cameraEntityUpdateComponentListenerId: number;

    Game.onLoad(() => {
        const {
            stage
        } = Canvas.getApp();

        const maskGameStage = getGraphics([], Color.BLACK);

        gameStage = getGraphics([], Color.GRAY_500, 0);
        gameStage.mask = maskGameStage;

        gameStageContainer = new PIXI.Container();
        gameStageContainer.name = 'GAME_STAGE_CONTAINER';
        gameStageContainer.sortableChildren = true;
        gameStage.addChild(maskGameStage, gameStageContainer);

        addDisplayObject(gameStageContainer);

        stage.addChild(gameStage);

        onResizeId = Canvas.onResize(() => {
            const {width, height} = Canvas.getBounds();

            gameStage.position.set(-(width / 2), -(height / 2));
            gameStageContainer.position.set((width / 2), (height / 2))
            updateGraphicsRectangle(gameStage, { width, height }, Color.GRAY_500);
            updateGraphicsRectangle(maskGameStage, { width, height }, Color.BLACK);
        });

        cameraEntityUpdateComponentListenerId = CAMERA_ENTITY.addUpdateComponentListener((component) => {
            if(![Component.ISOMETRIC_POSITION, Component.CAMERA].includes(component)) return;

            const isometricPositionComponent = CAMERA_ENTITY.getComponent<IsometricPositionComponent>(Component.ISOMETRIC_POSITION);

            const pos = getPositionFromIsometric(isometricPositionComponent, AzimuthEnum.NORTH);
            gameStageContainer.pivot.copyFrom(pos);

        });
    });

    Game.onDestroy(() => {
        const {
            stage
        } = Canvas.getApp();

        removeDisplayObject(gameStageContainer.name, { children: true });

        stage.removeChild(gameStage);
        gameStage.destroy({ children: true });

        Canvas.clearResize(onResizeId);
        CAMERA_ENTITY.removeUpdateComponentListener(cameraEntityUpdateComponentListenerId);
    });

    const onAdd = (id: string) => {
        gameStageContainer.addChild(Canvas.getDisplayObject(id));
    }
    
    const onUpdate = (id: string) => {
        const displayObject = Canvas.getDisplayObject(id);
        console.log('>', id)
        if(!gameStageContainer.getChildIndex(displayObject))
            gameStageContainer.addChild(displayObject);
    }
    
    const onRemove = (id: string) => {
        gameStageContainer.removeChild(Canvas.getDisplayObject(id));
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.GAME_STAGE
        ],
        onAdd,
        onUpdate,
        onRemove,
    }
};