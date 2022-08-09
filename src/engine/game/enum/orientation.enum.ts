
export enum AzimuthEnum {
    NORTH,
    NORTH_EAST = 45,
    EAST = 90,
    SOUTH_EAST = 135,
    SOUTH = 180,
    SOUTH_WEST = 225,
    WEST = 270,
    NORTH_WEST = 315
}
/*
               North-East
           North   ⇑     East
                ⇖     ⇗
  North-West  ⇐    *    ⇒  South-East
                ⇙     ⇘
           West    ⇓     South
               South-West
         
                  45
             0     ⇑      90
                ⇖     ⇗
         315  ⇐    *    ⇒ 135
                ⇙     ⇘
            270    ⇓    180
                  215
 */
