import {EntityType} from "darker-engine/build/types";
import {Component} from "../../component.const";
import {MapComponent} from "../../components/_map/map.component";
import {v4} from 'uuid';

export const mapEntity = (): EntityType => (() => {
    return {
        _id: v4(),
        _data: {
            [Component.MAP]: {
                version: 1
            } as MapComponent
        },
        _components: [
            Component.MAP
        ]
    }
})();