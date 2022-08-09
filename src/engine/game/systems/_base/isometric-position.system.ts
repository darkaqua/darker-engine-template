import {SystemFunction} from "darker-engine";
import {Game} from "../../game";
import {Component} from "../../component.const";
import {getPositionFromIsometric, getZIndexFromIsometricPosition} from "../../../utils/position.utils";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";
import {PositionComponent} from "../../components/position.component";
import {CAMERA_ENTITY} from "../../entities/camera.entity";
import {CameraComponent} from "../../components/camera.component";

export const isometricPositionSystem: SystemFunction = () => {
    const getEntity = (id: string) => Game.getEntity(id);

    const onAdd = (id: string) => onUpdate(id);

    const onUpdate = (id: string) => {
        const { getComponent, updateComponent } = getEntity(id);
        const isometricPosition = getComponent<IsometricPositionComponent>(Component.ISOMETRIC_POSITION);

        if(isometricPosition?.preventConversionToPosition) return;

        const { orientation } = CAMERA_ENTITY.getComponent<CameraComponent>(Component.CAMERA);

        const { x, y } = getPositionFromIsometric(
            isometricPosition,
            orientation
        );
        
        const zIndex = getZIndexFromIsometricPosition(isometricPosition, orientation);
    
        updateComponent(Component.POSITION, {
            x,
            y,
            zIndex: isometricPosition.zIndex || zIndex
        } as PositionComponent);

    }

    const onRemove = (id: string) => {
        const { removeComponent } = getEntity(id);

        removeComponent(Component.POSITION);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.ISOMETRIC_POSITION
        ],
        onAdd,
        onUpdate,
        onRemove
    }
};
