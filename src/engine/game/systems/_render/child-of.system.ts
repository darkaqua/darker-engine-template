
import {SystemFunction} from "darker-engine";
import {Canvas} from "../../../canvas/canvas";
import * as PIXI from 'pixi.js';
import {Game} from "../../game";
import {Component} from "../../component.const";
import {ChildOfComponent} from "../../components/child-of.component";

export const childOfSystem: SystemFunction = () => {

    const onAdd = (id: string) => {
        const childOfComponent = Game.getEntity(id).getComponent<ChildOfComponent>(Component.CHILD_OF);

        const child = Canvas.getDisplayObject(id) as PIXI.Container;
        const father = Canvas.getDisplayObject(childOfComponent.id) as PIXI.Container;

        const childDisplay = childOfComponent.deep ? child.children : [child];

        if(childDisplay.length === 0) return;

        father.addChild(...childDisplay);
    }

    const onRemove = (id: string) => {
        const childOfComponent = Game.getEntity(id).getComponent<ChildOfComponent>(Component.CHILD_OF);

        const father = Canvas.getDisplayObject(childOfComponent.id) as PIXI.Container;
        const child = Canvas.getDisplayObject(id) as PIXI.Container;

        const childDisplay = childOfComponent.deep ? child.children : [child];
        //TODO Not working

        father.removeChild(...childDisplay);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.CHILD_OF
        ],
        onAdd,
        onRemove
    }
};
