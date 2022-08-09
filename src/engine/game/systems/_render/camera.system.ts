import {SystemFunction} from "darker-engine";
// import * as PIXI from "pixi.js";
import {Component} from "../../component.const";
import {CameraComponent} from "../../components/camera.component";
import {getNextOrientation} from "../../../utils/orientation.utils";
import {Canvas} from "../../../canvas/canvas";
import {CAMERA_ENTITY} from "../../entities/camera.entity";
import {IsometricPositionComponent} from "../../components/isometricPosition.component";
import {System} from "../../../system/system";

export const cameraSystem: SystemFunction = () => {
    
    // let _keyDownList = [];
    
    let canvasOnUpdateId: number;
    let onKeyDownId: number;
    let onKeyUpId: number;

    // const keyList = ['e', 'q', 'w', 's', 'd', 'a'];
    const onAdd = (id: string) => {
        let isUpKey: boolean = false;
        let isDownKey: boolean = false;
        let isRightKeyDown: boolean = false;
        let isLeftKeyDown: boolean = false;
        let isClockwiseKeyDown: boolean = false;
        let isCounterClockwiseKeyDown: boolean = false;
    
        canvasOnUpdateId = Canvas.onUpdate(1, (delta) => {
            const deltaCalc = (delta / 4);
        
            if(isClockwiseKeyDown || isCounterClockwiseKeyDown) {
                const { orientation } = CAMERA_ENTITY.getComponent<CameraComponent>(Component.CAMERA);
                CAMERA_ENTITY.updateComponent(
                    Component.CAMERA,
                    {
                        orientation: getNextOrientation(orientation, isClockwiseKeyDown)
                    } as CameraComponent
                );
            }
        
            const updateIsometricPosition = (x: number, z: number) => {
                const isometricPosition = CAMERA_ENTITY.getComponent<IsometricPositionComponent>(Component.ISOMETRIC_POSITION);
            
                CAMERA_ENTITY.updateComponent(
                    Component.ISOMETRIC_POSITION,
                    {
                        ...isometricPosition,
                        x: isometricPosition.x + x,
                        z: isometricPosition.z + z
                    } as IsometricPositionComponent
                );
            }
        
            if(isDownKey && isLeftKeyDown)
                updateIsometricPosition(0, deltaCalc);
            else if(isDownKey && isRightKeyDown)
                updateIsometricPosition(deltaCalc, 0)
            else if(isDownKey)
                updateIsometricPosition(deltaCalc, deltaCalc)
        
            if(isUpKey && isRightKeyDown)
                updateIsometricPosition(0, - deltaCalc);
            else if(isUpKey && isLeftKeyDown)
                updateIsometricPosition(- deltaCalc, 0);
            else if(isUpKey)
                updateIsometricPosition(- deltaCalc, - deltaCalc)
        
        
            if(!isDownKey && !isUpKey && isRightKeyDown)
                updateIsometricPosition(deltaCalc / 2, - deltaCalc / 2)
        
            if(!isDownKey && !isUpKey && isLeftKeyDown)
                updateIsometricPosition(- deltaCalc / 2, deltaCalc / 2)
        
        });
    
        // const _restoreCamera = () => {
        //     CAMERA_ENTITY.updateComponent(
        //         Component.CAMERA,
        //         {
        //             orientation: AzimuthEnum.NORTH,
        //         } as CameraComponent,
        //     );
        //     CAMERA_ENTITY.updateComponent(
        //         Component.ISOMETRIC_POSITION,
        //         {
        //             x: 0,
        //             y: 0,
        //             z: 0
        //         } as IsometricPositionComponent
        //     );
        // }
        // onKeyDownId = System.io.keyboard.onKeyDown(({ key }) => {
        //     const lowerCaseKey = key.toLowerCase();
        //     // if(keyList.includes(lowerCaseKey))
        //     //     _keyDownList.push(lowerCaseKey);
        //
        //     switch (lowerCaseKey) {
        //         case 'w':
        //             isUpKey = true;
        //             PLAYER.actions.sit();
        //             return;
        //         case 's':
        //             isDownKey = true;
        //             PLAYER.actions.walk_south();
        //             return;
        //         case 'd':
        //             isRightKeyDown = true;
        //             // console.log(ARSE.actions.getSprite())
        //             return;
        //         case 'a':
        //             isLeftKeyDown = true;
        //             return;
        //         case ' ':
        //             _restoreCamera();
        //             return;
        //     }
        // });
        // onKeyUpId = System.io.keyboard.onKeyUp(({ key }) => {
        //     const lowerCaseKey = key.toLowerCase();
        //
        //     const clearIsometricPosition = () => {
        //         const isometricPosition = CAMERA_ENTITY.getComponent<IsometricPositionComponent>(Component.ISOMETRIC_POSITION);
        //
        //         CAMERA_ENTITY.updateComponent(
        //             Component.ISOMETRIC_POSITION,
        //             {
        //                 ...isometricPosition,
        //                 x: Math.round(isometricPosition.x),
        //                 y: Math.round(isometricPosition.y),
        //                 z: Math.round(isometricPosition.z)
        //             } as IsometricPositionComponent
        //         );
        //     }
        //
        //     switch (lowerCaseKey) {
        //         case 'w':
        //             isUpKey = false;
        //             clearIsometricPosition();
        //             return;
        //         case 's':
        //             isDownKey = false;
        //             clearIsometricPosition();
        //             return;
        //         case 'd':
        //             isRightKeyDown = false;
        //             clearIsometricPosition();
        //             return;
        //         case 'a':
        //             isLeftKeyDown = false;
        //             clearIsometricPosition();
        //             return;
        //     }
        //    // _keyDownList = _keyDownList.filter(_key => key !== _key);
        // });
    }
    
    const onRemove = () => {
        Canvas.clearUpdate(1, canvasOnUpdateId);
        System.io.keyboard.clearKeyUp(onKeyUpId);
        System.io.keyboard.clearKeyDown(onKeyDownId);
    }
    
    return {
        components: [
            Component.CAMERA,
        ],
        onAdd,
        onRemove
    }
};
