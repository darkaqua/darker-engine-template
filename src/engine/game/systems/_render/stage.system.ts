import {SystemFunction} from "darker-engine";
import {Canvas} from "../../../canvas/canvas";
import * as PIXI from 'pixi.js';
import {Component} from "../../component.const";

export const stageSystem: SystemFunction = () => {

    const getStage = (): PIXI.Container => Canvas.getApp().stage;

    const onAdd = (id: string) => {
        getStage().addChild(Canvas.getDisplayObject(id));
    }
    
    const onUpdate = (id: string) => {
        const displayObject = Canvas.getDisplayObject(id);
        console.log('>', id)
        if(!getStage().getChildIndex(displayObject))
            getStage().addChild(displayObject);
    }
    
    const onRemove = (id: string) => {
        getStage().removeChild(Canvas.getDisplayObject(id));
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.STAGE
        ],
        onAdd,
        onUpdate,
        onRemove
    }
};
