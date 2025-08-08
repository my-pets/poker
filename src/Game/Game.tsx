import { useEffect, useState } from 'react';
import { Dices } from '../components/Dices/Dices';
import { ResultTable } from '../components/ResultsTable/ResultTable';
import useLocalStorage from 'use-local-storage';
import { Box, TableContainer } from '@mui/material';
import { socket } from '../socket/socket';
import { GameEntity } from '../socket/entities/game.entity';
import { GameStatus } from '../socket/enums/game-status.enum';

const EMPTY_DICES = [1, 1, 1, 1, 1];
const EMPTY_SAVED_DEICES = [false, false, false, false, false];

type GameProps = {
    gameCode: string;
    code: string;
};

export const Game = ({ gameCode, code }: GameProps) => {
    const [savedDices, setSavedDices] = useLocalStorage('savedDices', EMPTY_SAVED_DEICES);
    const [isYourTurn, setIsYourTurn] = useState(false);

    const [game, setGame] = useState<GameEntity | null>(null);

    const onShake = () => {
        socket.emit('shake', {
            gameCode,
            code,
            savedDices,
        });
    };

    const onSaveDice = (savedI: number) => {
        if (game?.currentDicesInfo?.shakeCount === 0) return;
        if (game?.currentDicesInfo?.dices[savedI] === 0) return;
        setSavedDices((prev) => prev?.map((savedDice, index) => (savedI === index ? !savedDice : savedDice)));
    };

    useEffect(() => {
        socket.on('game', (data: GameEntity) => {
            const you = data.players.find(({ code: playerCode }) => code === playerCode)

            setSavedDices(data.currentDicesInfo?.savedDices ?? EMPTY_SAVED_DEICES);
            setGame(data);
            setIsYourTurn(you?.order === data.currentOrder);
        });
        socket.emit('get-game', {
            gameCode,
            code,
        });
    }, []);

    return (
        <div>
            <Box sx={{ userSelect: 'none' }}>Current shake: {game?.currentDicesInfo?.shakeCount ?? 0}</Box>
            <Dices
                dices={game?.currentDicesInfo?.dices ?? EMPTY_DICES}
                shakeHandler={onShake}
                savedDices={savedDices}
                onSaveDice={onSaveDice}
                shakeCount={game?.currentDicesInfo?.shakeCount ?? 0}
                isYourTurn={isYourTurn}
            />
            {!!game && game.status === GameStatus.IN_PROGRESS && (
                <TableContainer
                    sx={{ justifyItems: 'center', userSelect: 'none', display: 'flex', justifyContent: 'center', gap: '1px' }}
                    tabIndex={-1}
                >
                    {game.players
                        .sort((a, b) => (b?.order ?? 0) - (a?.order ?? 0))
                        .map((player, i) => (
                            <ResultTable key={player.code} game={game} player={player} isLables={i === 0}/>
                        ))}
                </TableContainer>
            )}
        </div>
    );
};
