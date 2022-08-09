import {MenuEnum} from "./menu.enum";
import {MenuFunctionType} from "./menu.type";
import {MenuHome} from "./home/home.menu";
import {Canvas} from "../canvas/canvas";
import * as PIXI from 'pixi.js';

export const Menu = (() => {

    let menuContainer: PIXI.Container;
    const stackList: MenuEnum[] = [];

    const menuRecord: Record<MenuEnum, MenuFunctionType> = {
        [MenuEnum.HOME]: MenuHome(),
    };

    const load = async () => {
        menuContainer = new PIXI.Container();
        Canvas.getApp().stage.addChild(menuContainer);

        await open(MenuEnum.HOME);
    }

    const open = async (...menuList: MenuEnum[]) => {
        const promiseList = menuList.map(async (menu) => {
            const {
                onOpen: onTargetOpen,
                getContainer: getTargetContainer
            } = menuRecord[menu];
    
            if(stackList.length > 0) {
                const currentMenu = stackList[stackList.length - 1];
                const {
                    onClose: onCurrentClose,
                    getContainer: getCurrentContainer
                } = menuRecord[currentMenu];
        
                await onCurrentClose();
                menuContainer.removeChild(getCurrentContainer());
            }
    
            stackList.push(menu);
    
            await onTargetOpen();
            menuContainer.addChild(getTargetContainer());
        });
        await Promise.all(promiseList);
    }

    const goBack = async () => {
        const currentMenu = stackList.pop();
        const {
            getContainer: getCurrentContainer,
            onClose
        } = menuRecord[currentMenu];

        menuContainer.removeChild(getCurrentContainer());
        await onClose();

        const targetMenu = stackList[stackList.length - 1];
        const {
            getContainer: getTargetContainer
        } = menuRecord[targetMenu];

        menuContainer.addChild(getTargetContainer());
    }

    const close = async () => {
        menuContainer.removeChildren();
        for (let i = 0; i < stackList.length; i++) {
            const currentMenu = stackList.pop();
            const {
                onClose
            } = menuRecord[currentMenu];
            await onClose();
        }
    }

    return {
        load,
        open,
        close,
        goBack
    }
})();