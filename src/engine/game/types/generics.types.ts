

export type Position = {
    x: number;
    y: number;
}

export type Position3d = {
    x: number;
    y: number;
    z: number;
}


export type Size = {
    sizeX: number;
    sizeY: number;
}

export type Rectangle = Position & Size;