import {spriteSystem} from "./_render/sprite.system";
import {animatedSpriteSystem} from "./_render/animatedSprite.system";
import {containerSystem} from "./_render/container.system";
import {particleContainerSystem} from "./_render/particle-container.system";
import {stageSystem} from "./_render/stage.system";
import {childOfSystem} from "./_render/child-of.system";
import {cameraSystem} from "./_render/camera.system";
import {gameStageSystem} from "./_render/game-stage.system";
import {positionSystem} from "./_base/position.system";
import {pivotSystem} from "./_render/pivot.system";
import {isometricPositionSystem} from "./_base/isometric-position.system";
import {mapSystem} from "./_base/map.system";
import {SystemFunction} from "darker-engine/build/types";
import {cursorSystem} from "./_base/cursor.system";
import {uiSystem} from "./_base/ui.system";

export const getSystemList = (): SystemFunction[] => [
    // display-objects
    spriteSystem,
    animatedSpriteSystem,
    containerSystem,
    particleContainerSystem,
    stageSystem,
    childOfSystem,
    //
    cursorSystem,
    cameraSystem,

    gameStageSystem,
    //positions
    positionSystem,
    pivotSystem,

    uiSystem,
    
    //game
    mapSystem,
    isometricPositionSystem,
];