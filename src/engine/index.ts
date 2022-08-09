import {Color} from "./enums/colors.enum";
import {Canvas} from "./canvas/canvas";
import {SpriteSheets} from "./sprite-sheets/sprite-sheets";
import {__Test} from "./test/test";
import {System} from "./system/system";
import {Splash} from "./splash/splash";
import {Overlay} from "./overlay/overlay";
import {Menu} from "./menu/menu";

document.body.style.backgroundColor = `#${Color.GRAY_500}`;

(async () => {
    
    await __Test.loadStart();
    Canvas.load();
    await Splash.load();
    await System.load();
    
    console.log(`**** ${System.name} - build ${System.buildId} ****`);
    console.log(`**** game path: ${System.getGamePath()} ****`);
    
    await SpriteSheets.load();
    await Overlay.load();

    await Menu.load();

    await __Test.loadEnd();

    Canvas.reload();
    Splash.destroy();
    
})();
