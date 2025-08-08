import { GameEntity } from './game.entity';

export type PlayerEntity = {
    code: string;
    client?: string;
    table?: string[][];
    isAdmin?: boolean;
    order?: number;
    game?: GameEntity;
    gameCode?: string;
    currentPlayerInfo?: CurrentPlayerInfo;
};

export type CurrentPlayerInfo = {
    downIndex: number;
    upIndex: number;
    combsNumber: number;
}