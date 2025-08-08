import { socket } from './socket';

export type EnterGame = {
    code: string;
    gameCode: string;
    playersCount?: number;
};

export const sendEnterGame = (data: EnterGame) => {
    socket.emit('enter-the-game', data);
};

