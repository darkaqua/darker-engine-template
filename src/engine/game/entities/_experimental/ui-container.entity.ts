import {v4} from "uuid";
import {EntityType} from "darker-engine/build/types";
import {Component} from "../../component.const";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";

const uiContainerEntity = (): EntityType => ({
    _id: v4() + 'ui',
    _data: {
        [Component.ISOMETRIC_POSITION]: {
            x: 0,
            y: 0,
            z: 0
        } as IsometricPositionComponent
    },
    _components: [
        Component.DISPLAY_OBJECT,
        Component.SPRITE,
        // Component.CONTAINER,
        Component.ISOMETRIC_POSITION,
        Component.STAGE,
        Component.UI
    ]
});

export const UI_CONTAINER = uiContainerEntity();