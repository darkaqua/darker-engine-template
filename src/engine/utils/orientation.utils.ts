import {AzimuthEnum} from "../game/enum/orientation.enum";

export const getNextOrientation = (orientation: AzimuthEnum, clockwise: boolean = true): AzimuthEnum =>
    clockwise
        ? (orientation + 45 > AzimuthEnum.NORTH_WEST ? 0 : orientation + 45)
        : ((orientation - 45) >= AzimuthEnum.NORTH ? orientation - 45 : AzimuthEnum.NORTH_WEST);