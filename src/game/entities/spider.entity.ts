import {EntityFunction} from "darker-engine";
import {ComponentEnum} from "../component.enum";

export const spiderEntity: EntityFunction<ComponentEnum> = (
    name: string
) => ({
    id: name,
    data: {
        [ComponentEnum.SPRITE]: {
            texture: require('../../assets/800427255423303680.png').default
        }
    },
    components: [
        ComponentEnum.SPRITE,
        ComponentEnum.SPIDY,
        ComponentEnum.MOB
    ]
});
