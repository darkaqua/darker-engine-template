import {game as darkerGame} from "darker-engine";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import dayjs from "dayjs";

dayjs.extend(advancedFormat);

export const Game = darkerGame();
