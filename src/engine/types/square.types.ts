import {CubeType} from "./cube.types";

export type SquareType = {
    // version
    v: 2 | 3,
    // cube list
    c: CubeType[]
    // near face cube index list
    i?: number[]
}