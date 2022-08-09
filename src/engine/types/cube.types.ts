import {Color} from "../enums/colors.enum";

export type CubeType = [CubeId, CubeRandomNumber, CubeFacesColor];

export type CubeId = 0 | 1;
export type CubeRandomNumber = number;
export type CubeFaceColor = Color;
export type CubeFacesColor = CubeFaceColor[];

// const cube: Cube = [1, 3.2, [Color.WHITE]];