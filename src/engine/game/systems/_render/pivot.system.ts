import {SystemFunction} from "darker-engine";
import {Canvas} from "../../../canvas/canvas";
import {Game} from "../../game";
import {Component} from "../../component.const";
import {PivotComponent} from "../../components/pivot.component";

export const pivotSystem: SystemFunction = () => {

    const getEntity = (id: string) => Game.getEntity(id);

    const onAdd = (id: string) => onUpdate(id);

    const onUpdate = (id: string) => {
        const { getComponent } = getEntity(id);
        const { x, y } = getComponent<PivotComponent>(Component.PIVOT);

        const displayObject = Canvas.getDisplayObject(id);
        displayObject.pivot.set(x, y);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.PIVOT
        ],
        onAdd,
        onUpdate
    }
};
