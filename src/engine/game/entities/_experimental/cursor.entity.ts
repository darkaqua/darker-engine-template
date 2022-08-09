import {EntityType} from "darker-engine/build/types";
import {Component} from "../../component.const";

const cursorEntity = (): EntityType => ({
    _id: 'CURSOR',
    _data: {},
    _components: [
        Component.CURSOR
    ]
});

export const CURSOR = cursorEntity();