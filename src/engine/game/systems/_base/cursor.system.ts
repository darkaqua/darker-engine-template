import {SystemFunction} from "darker-engine";
import {Component} from "../../component.const";
import {CAMERA_ENTITY} from "../../entities/camera.entity";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";
import {Position, Position3d} from "../../types/generics.types";
import {Canvas} from "../../../canvas/canvas";
import {getRoundPosition, isPosition3dEqual} from "../../../utils/position.utils";
import {System} from "../../../system/system";
import {CURSOR} from "../../entities/_experimental/cursor.entity";
import {CursorComponent} from "../../components/cursor.component";

export const cursorSystem: SystemFunction = () => {
    
    const { cursor } = System.io;
    let cursorOnLeftClickId: number;
    let cursorOnRightClickId: number;
    let cursorOnMoveId: number;
    let cameraEntityUpdateComponentListenerId: number;

    let _lastCursorPosition: Position = { x: 0, y: 0 };
    let _lastCurrentIsometricPosition: Position3d = { x: 0, y: 0, z: 0 };
    let _lastCameraIsometricPosition: Position3d = { x: 0, y: 0, z: 0 };

    const _getIsometricPosition = (clientX: number, clientY: number): Position3d => {
        const {width, height} = Canvas.getBounds();
        const scale = Canvas.getScale();

        const midWidth = width / 2;
        const midHeight = height / 2;

        const relX = Math.floor(((clientX / scale) - midWidth));
        const relY = Math.floor(((clientY / scale)  - midHeight));

        const isRelXOdd = Math.floor((relX / 2) % 2) === 0;

        const absolutePosition: Position = {
            x: relX - Math.abs(relX % 2),
            y: relY - Math.abs(relY % 2 === 0 ? (isRelXOdd ? 0 : 1) : (isRelXOdd ? 1 : 0)),
        }

        const isometricPosition: Position3d = {
            x: Math.round((absolutePosition.x / 2) - (((absolutePosition.x / 2) - absolutePosition.y) / 2)),
            y: 0,
            z: Math.round((absolutePosition.y - (absolutePosition.x / 2)) / 2)
        }

        const { x: isoX, y: isoY, z: isoZ } = getRoundPosition(_lastCameraIsometricPosition);

        return {
            x: isometricPosition.x + isoX - isoY,
            y: 0,
            z: isometricPosition.z + isoZ - isoY
        };
    }

    const onAdd = (id: string) => {
        const _invokeOnMouseMove = (clientX, clientY) => {
            const currentIsometricPosition = _getIsometricPosition(clientX, clientY);

            if(!isPosition3dEqual(currentIsometricPosition, _lastCurrentIsometricPosition)) {
                _lastCurrentIsometricPosition = currentIsometricPosition;
                CURSOR.updateComponent<CursorComponent>(Component.CURSOR, { currentIsometricPosition } as CursorComponent);
            }
        }

        cursorOnLeftClickId = cursor.onLeftClick((event) => {
            CURSOR.updateComponent<CursorComponent>(Component.CURSOR, {  } as CursorComponent);
        });
        
        cursorOnRightClickId = cursor.onRightClick((event) => {
            CURSOR.updateComponent<CursorComponent>(Component.CURSOR, {  } as CursorComponent);
        });

        cursorOnMoveId = cursor.onMove((event) => {
            const { clientX, clientY } = event;
            _lastCursorPosition = { x: clientX, y: clientY };

            _invokeOnMouseMove(clientX, clientY);
        });

        cameraEntityUpdateComponentListenerId = CAMERA_ENTITY.addUpdateComponentListener((component, data) => {
            if (component !== Component.ISOMETRIC_POSITION) return;

            _lastCameraIsometricPosition = data as any as IsometricPositionComponent;

            const { x: clientX, y: clientY } = _lastCursorPosition;

            _invokeOnMouseMove(clientX, clientY);
        });
    }

    const onRemove = (id: string) => {
        cursor.clearLeftClick(cursorOnLeftClickId);
        cursor.clearRightClick(cursorOnRightClickId);
        cursor.clearMove(cursorOnMoveId);
        CAMERA_ENTITY.removeUpdateComponentListener(cameraEntityUpdateComponentListenerId);
    }

    return {
        components: [
            Component.CURSOR
        ],
        onAdd,
        onRemove
    }
};
