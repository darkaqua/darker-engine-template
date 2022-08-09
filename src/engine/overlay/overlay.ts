import {TextConfig, textDisplayObject} from "../game/display-objects/text.display-object";
import {Color} from "../enums/colors.enum";
import {System} from "../system/system";
import {Canvas} from "../canvas/canvas";

export const Overlay = (() => {

    const load = () => {
        const textConfig: TextConfig = {
            backgroundColor: Color.BLACK,
            backgroundOpacity: .75,
            padding: [6, 3, 6, 3]
        };

        const nameText = textDisplayObject(System.name, textConfig);
        const buildIdText = textDisplayObject(`Build ${System.buildId}${System.isDevelopment ? ' DEV' : ''}`, textConfig);

        const containerList = [nameText.getContainer(), buildIdText.getContainer()];

        const _render = () => {
            const {width, height} = Canvas.getBounds();

            containerList.forEach((container, index) => {
                container.zIndex = Number.MAX_SAFE_INTEGER + 20;
                container.position.set(
                    (width / 2) - container.width,
                    - (height / 2) + (index * container.height)
                )
            });
        }
        Canvas.onResize(() => {
            _render();
        });
        _render();
        Canvas.getApp().stage.addChild(...containerList)
    }

    return {
        load
    }
})();