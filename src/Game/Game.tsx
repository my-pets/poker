import { useEffect, useState } from 'react';
import { Dices } from '../components/Dices/Dices';
import { ResultTable } from '../components/ResultsTable/ResultTable';
import useLocalStorage from 'use-local-storage';
import { Box, TableContainer } from '@mui/material';
import { socket } from '../socket/socket';
import { CurrentDicesInfo, GameEntity } from '../socket/entities/game.entity';
import { GameStatus } from '../socket/enums/game-status.enum';
import { sendEnterGame } from '../socket/enter-game.type';

const EMPTY_DICES = [1, 1, 1, 1, 1];
const EMPTY_SAVED_DEICES = [false, false, false, false, false];

type GameProps = {
    gameCode: string;
    code: string;
    playersCount: number;
};

export const Game = ({ gameCode, code, playersCount }: GameProps) => {
    const [savedDices, setSavedDices] = useLocalStorage('savedDices', EMPTY_SAVED_DEICES);
    const [isYourTurn, setIsYourTurn] = useState(false);

    const [game, setGame] = useState<GameEntity | null>(null);
    const [currentDicesInfo, setCurrentDicesInfo] = useState<CurrentDicesInfo | undefined>(undefined);

    const onShake = () => {
        socket.emit('shake', {
            gameCode,
            code,
            savedDices,
        });
    };

    const onSaveDice = (savedI: number) => {
        if (currentDicesInfo?.shakeCount === 0) return;
        if (currentDicesInfo?.dices[savedI] === 0) return;
        setSavedDices((prev) => prev?.map((savedDice, index) => (savedI === index ? !savedDice : savedDice)));
    };

    useEffect(() => {
        socket.on('game', (data: GameEntity) => {
            const you = data.players.find(({ code: playerCode }) => code === playerCode);

            setSavedDices(data.currentDicesInfo?.savedDices ?? EMPTY_SAVED_DEICES);
            setGame(data);
            setIsYourTurn(you?.order === data.currentOrder);
            setCurrentDicesInfo(data.currentDicesInfo);
        });
        socket.on('current-dices-info', (data: CurrentDicesInfo) => {
            setSavedDices(data.savedDices ?? EMPTY_SAVED_DEICES);
            setCurrentDicesInfo(data);
        });
        socket.on('connect', () => {
            console.log('Connected:', socket.id);
            if (gameCode && code) {
                sendEnterGame({
                    gameCode,
                    code,
                    playersCount,
                });
            }
        });
    }, []);

    return (
        <div>
            <Box sx={{ userSelect: 'none', marginTop: '16px' }}>Current shake: {currentDicesInfo?.shakeCount ?? 0}</Box>
            <Dices
                dices={currentDicesInfo?.dices ?? EMPTY_DICES}
                shakeHandler={onShake}
                savedDices={savedDices}
                onSaveDice={onSaveDice}
                shakeCount={currentDicesInfo?.shakeCount ?? 0}
                isYourTurn={isYourTurn}
            />
            {!!game && game.status !== GameStatus.NEW && (
                <TableContainer
                    sx={{
                        justifyItems: 'center',
                        userSelect: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1px',
                    }}
                    tabIndex={-1}
                >
                    {game.players
                        .sort((a, b) => (b?.order ?? 0) - (a?.order ?? 0))
                        .map((player, i) => (
                            <ResultTable
                                key={player.code}
                                gameCode={game.code}
                                currentOrder={game.currentOrder ?? 1}
                                combinations={currentDicesInfo?.combinations}
                                player={player}
                                isLables={i === 0}
                            />
                        ))}
                </TableContainer>
            )}
        </div>
    );
};
