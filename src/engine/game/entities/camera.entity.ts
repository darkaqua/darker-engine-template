import {Component} from "../component.const";
import {EntityType} from "darker-engine/build/types";
import {CameraComponent} from "../components/camera.component";
import {AzimuthEnum} from "../enum/orientation.enum";
import {IsometricPositionComponent} from "../components/isometricPosition.component";

const cameraEntity = (): EntityType => ({
    _id: 'CAMERA_ENTITY_ID',
    _data: {
        [Component.CAMERA]: {
            orientation: AzimuthEnum.NORTH
        } as CameraComponent,
        [Component.ISOMETRIC_POSITION]: {
            x: 0,
            y: 0,
            z: 0
        } as IsometricPositionComponent
    },
    _components: [
        Component.CAMERA,
        Component.ISOMETRIC_POSITION
    ]
});

export const CAMERA_ENTITY = cameraEntity();