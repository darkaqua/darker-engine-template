import {MenuType} from "../menu.type";
import {textDisplayObject} from "../../game/display-objects/text.display-object";
import {Color} from "../../enums/colors.enum";
import * as PIXI from "pixi.js";
import {Menu} from "../menu";
import {MenuEnum} from "../menu.enum";
import {Game} from "../../game/game";
import {getSystemList} from "../../game/systems/systems";
import {CAMERA_ENTITY} from "../../game/entities/camera.entity";
import {CURSOR} from "../../game/entities/_experimental/cursor.entity";
import {PLAYER} from "../../game/entities/player/player.entity";
import {Canvas} from "../../canvas/canvas";
import {mapEntity} from "../../game/entities/_map/map.entity";
import {System} from "../../system/system";
import {UI_CONTAINER} from "../../game/entities/_experimental/ui-container.entity";

export const MenuHome: MenuType = (() => {

    let container: PIXI.Container;

    const onOpen = async () => {
        if(container) return;

        container = new PIXI.Container();

        const text = textDisplayObject('Play', {
            padding: [6, 3, 6, 3],
            color: Color.WHITE,
            align: 'center',
            hoverColor: Color.GRAY
        });
        const textContainer: PIXI.Container = text.getContainer();
        textContainer.on('click', () => {
            Menu.close();
    
            Game.clear();
            Game.setSystems(...getSystemList());
    
            Game.addEntity(CAMERA_ENTITY, CURSOR);
            Game.load();
            Game.addEntity(UI_CONTAINER, PLAYER);
    
            Canvas.reload();
            Game.addEntity(mapEntity());
    
            const _onKeyUpId = System.io.keyboard.onKeyUp(async ({ key }) => {
                if(key !== 'Escape') return;
        
                System.io.keyboard.clearKeyUp(_onKeyUpId);
                Game.destroy();
                await Menu.open(MenuEnum.HOME);
            });
        });

        container.addChild(textContainer);
    }

    const onClose = async () => {

    }

    const getContainer = () => container;

    return {
        onOpen,
        onClose,
        getContainer
    }
})