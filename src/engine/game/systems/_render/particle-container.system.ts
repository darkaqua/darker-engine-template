import {SystemFunction} from "darker-engine";
import * as PIXI from 'pixi.js';
import {displayObjectSystem} from "./_displayObject.system";
import {Component} from "../../component.const";
import {Game} from "../../game";
import {ParticleContainerComponent} from "../../components/particleContainer.component";

export const particleContainerSystem: SystemFunction = () => {

    const { addDisplayObject, removeDisplayObject, getDisplayObject } = displayObjectSystem();

    const onAdd = (id: string) => {
        const entity = Game.getEntity(id);
        const { maxSize, renderable } = entity.getComponent<ParticleContainerComponent>(Component.PARTICLE_CONTAINER);

        const container = new PIXI.ParticleContainer(maxSize, {});
        container.renderable = renderable === undefined ? true : renderable;
        container.name = id;
        addDisplayObject(container);
    }

    const onUpdate = (id: string, component?: string) => {
        if(component === Component.PARTICLE_CONTAINER) {
            const entity = Game.getEntity(id);
            const { renderable } = entity.getComponent<ParticleContainerComponent>(Component.PARTICLE_CONTAINER);

            const displayObject = getDisplayObject(id);
            displayObject.renderable = !!renderable;
        }
    }

    const onRemove = (id: string) => {
        removeDisplayObject(id);
    }

    return {
        components: [
            Component.DISPLAY_OBJECT,
            Component.PARTICLE_CONTAINER
        ],
        onAdd,
        onUpdate,
        onRemove
    }
};
