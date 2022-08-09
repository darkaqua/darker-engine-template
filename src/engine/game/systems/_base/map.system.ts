import {SystemFunction} from "darker-engine";
import {Component} from "../../component.const";

export const mapSystem: SystemFunction = () => {

    const onAdd = (id: string) => {
    }
    
    const onRemove = (id: string) => {
    }
    
    return {
        components: [
            Component.MAP
        ],
        onAdd,
        onRemove
    }
};