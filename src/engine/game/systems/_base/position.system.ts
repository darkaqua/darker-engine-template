import {SystemFunction} from "darker-engine";
import {Canvas} from "../../../canvas/canvas";
import {Game} from "../../game";
import {Component} from "../../component.const";
import {PositionComponent} from "../../components/position.component";

export const positionSystem: SystemFunction = () => {

    const getEntity = (id: string) => Game.getEntity(id);

    const onAdd = (id: string) => onUpdate(id);

    const onUpdate = (id: string) => {
        const { getComponent, updateComponent } = getEntity(id);
        const { x, y, zIndex } = getComponent<PositionComponent>(Component.POSITION);
    
        const displayObject = Canvas.getDisplayObject(id);
        displayObject.position.set(x, y);

        if(zIndex !== undefined)
            displayObject.zIndex = zIndex;

        if(x === undefined && y === undefined)
            updateComponent(Component.POSITION, { x: 0, y: 0 });
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.POSITION
        ],
        onAdd,
        onUpdate
    }
};
