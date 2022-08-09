import {SystemFunction} from "darker-engine";
import * as PIXI from 'pixi.js';
import {displayObjectSystem} from "./_displayObject.system";
import {Component} from "../../component.const";

export const containerSystem: SystemFunction = () => {

    const { addDisplayObject, removeDisplayObject } = displayObjectSystem();

    const onAdd = (id: string) => {
        const container = new PIXI.Container();
        container.name = id;
        addDisplayObject(container);
    }

    const onRemove = (id: string) => {
        removeDisplayObject(id);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.CONTAINER
        ],
        onAdd,
        onRemove
    }
};
