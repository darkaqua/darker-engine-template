import {Position, Position3d, Rectangle} from "../game/types/generics.types";
import {AzimuthEnum} from "../game/enum/orientation.enum";

export const MAX_ARRAY_BITES = 32;

export const MAX_ARRAY_LENGTH = (2 ** MAX_ARRAY_BITES) - 4;
export const MAX_SIDE_LENGTH = Math.floor(Math.cbrt(MAX_ARRAY_LENGTH));

/*
public int to1D( int x, int y, int z ) {
    return (z * xMax * yMax) + (y * xMax) + x;
}

public int[] to3D( int idx ) {
    final int z = idx / (xMax * yMax);
    idx -= (z * xMax * yMax);
    final int y = idx / xMax;
    final int x = idx % xMax;
    return new int[]{ x, y, z };
}
 */
//TODO Calculate negatives indexes
export const getIndexFromPosition3d = ({ x, y, z }: Position3d): number => {
    // if(0 > x || 0 > y || 0 > z) return -1;
    const index = (z * MAX_SIDE_LENGTH * MAX_SIDE_LENGTH) + (y * MAX_SIDE_LENGTH) + x;
    if(index > MAX_ARRAY_LENGTH)
        throw Error(`MAX_INDEX_ERROR [${index}>${MAX_ARRAY_LENGTH}] x:${x} y:${y} z:${z}`);
    return index;
};

// export const getPosition3dFromIndex = (index: number): Position3d => {
//     // if(index === -1) return undefined;
//
//     const z = Math.round(index / (MAX_SIDE_LENGTH * MAX_SIDE_LENGTH));
//     const _index = index - Math.round(z * MAX_SIDE_LENGTH * MAX_SIDE_LENGTH);
//     const y = Math.round(_index / MAX_SIDE_LENGTH);
//     const x = Math.round(_index % MAX_SIDE_LENGTH);
//     return { x, y, z };
// }

export const getPositionFromIsometric = (
    point: Position3d,
    orientation: AzimuthEnum
): Position => {
    switch (orientation) {
        case AzimuthEnum.NORTH:
            return {
                x: - (point.z - point.x) * 2,
                y: point.z + point.x - (point.y * 2)
            }
        case AzimuthEnum.EAST:
            return {
                x: - (point.z + point.x) * 2,
                y: - point.z + point.x - (point.y * 2)
            }
        case AzimuthEnum.SOUTH:
            return {
                x: (point.z - point.x) * 2,
                y: - point.z - point.x - (point.y * 2)
            }
        case AzimuthEnum.WEST:
            return {
                x: (point.z + point.x) * 2,
                y: point.z - point.x - (point.y * 2)
            }
        case AzimuthEnum.NORTH_EAST:
            return {
                x: - point.z * 2,
                y: (point.x * 2) - (point.y * 2)
            }
        case AzimuthEnum.SOUTH_EAST:
            return {
                x: - point.x * 2,
                y: - (point.z * 2) - (point.y * 2)
            }
        case AzimuthEnum.SOUTH_WEST:
            return {
                x: point.z * 2,
                y: - (point.x * 2) - (point.y * 2)
            }
        case AzimuthEnum.NORTH_WEST:
            return {
                x: point.x * 2,
                y: (point.z * 2) - (point.y * 2)
            }
    }
}

export const getZIndexFromIsometricPosition = (
    isometricPosition: Position3d,
    orientation: AzimuthEnum
): number => {
    switch (orientation) {
        case AzimuthEnum.WEST:
            return - isometricPosition.x + isometricPosition.z + isometricPosition.y;
        case AzimuthEnum.EAST:
        case AzimuthEnum.SOUTH_EAST:
            return isometricPosition.x - isometricPosition.z + isometricPosition.y;
        case AzimuthEnum.SOUTH:
        case AzimuthEnum.SOUTH_WEST:
            return - isometricPosition.x - isometricPosition.z + isometricPosition.y;
        default:
            return isometricPosition.x + isometricPosition.z + isometricPosition.y;
    }
}

export const isPosition3dEqual = (point1: Position3d, point2: Position3d): boolean =>
    point1.x === point2.x && point1.y === point2.y && point1.z === point2.z;

export const isPositionEqual = (point1: Position, point2: Position): boolean => point1.x === point2.x && point1.y === point2.y;

export const isPositionInside = (point: Position, rectangle: Rectangle): boolean =>
    point.x >= rectangle.x && point.x <= rectangle.x + rectangle.sizeX && point.y >= rectangle.y && point.y <= rectangle.y + Math.trunc(rectangle.sizeY / 2);

export const getFurthestPosition3d = (position: Position3d, positionList: Position3d[]): Position3d => positionList
    .reduce((furthestPosition, currentPosition) => {
        const correctedCurrentPositionX = Math.abs(currentPosition.x - position.x);
        const correctedCurrentPositionY = Math.abs(currentPosition.y - position.y);
        const correctedCurrentPositionZ = Math.abs(currentPosition.z - position.z);
        const currentPositionSum = correctedCurrentPositionX + correctedCurrentPositionY + correctedCurrentPositionZ;
        
        const correctedFurthestPositionX = Math.abs(furthestPosition.x - position.x);
        const correctedFurthestPositionY = Math.abs(furthestPosition.y - position.y);
        const correctedFurthestPositionZ = Math.abs(furthestPosition.z - position.z);
        const furthestPositionSum = correctedFurthestPositionX + correctedFurthestPositionY + correctedFurthestPositionZ;
        
        
        return currentPositionSum > furthestPositionSum ? currentPosition : furthestPosition;
    }, position);

export const sortByCenterPosition3d = (centerPosition: Position3d, positionA: Position3d, positionB: Position3d): number => {
    const correctedCurrentPositionX = Math.abs(positionA.x - centerPosition.x);
    const correctedCurrentPositionY = Math.abs(positionA.y - centerPosition.y);
    const correctedCurrentPositionZ = Math.abs(positionA.z - centerPosition.z);
    const currentPositionSum = correctedCurrentPositionX + correctedCurrentPositionY + correctedCurrentPositionZ;

    const correctedFurthestPositionX = Math.abs(positionB.x - centerPosition.x);
    const correctedFurthestPositionY = Math.abs(positionB.y - centerPosition.y);
    const correctedFurthestPositionZ = Math.abs(positionB.z - centerPosition.z);
    const furthestPositionSum = correctedFurthestPositionX + correctedFurthestPositionY + correctedFurthestPositionZ;


    return currentPositionSum > furthestPositionSum ? -1 : 1;
}

export const getRoundPosition = (position: Position3d): Position3d => ({
    x: Math.round(position.x),
    y: Math.round(position.y),
    z: Math.round(position.z)
})