import { GameStatus } from '../enums/game-status.enum';
import { PlayerEntity } from './player.entity';

export type GameEntity = {
    code: string;
    status: GameStatus;
    playersCount?: number;
    currentOrder?: number;
    currentDicesInfo?: CurrentDicesInfo;
    players: PlayerEntity[];
};

export type CurrentDicesInfo = {
    dices: number[];
    savedDices: boolean[];
    shakeCount: number;
    combinations: number[];
}
