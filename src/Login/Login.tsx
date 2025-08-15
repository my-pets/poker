import React, { useRef, useState } from 'react';
import { Box, TextField, Typography, Button, Switch, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { getRandomCode } from './helper';
import { OverflowDialog } from '../components/OverflowDialog';
import './Login.css';

const colors = ['#FFD700', '#FF0000', '#1E90FF', '#32CD32', '#9370DB'];
const length = 5;

type LoginProps = {
    existedGameCode?: string[];
    existedCode?: string;
    onSubmit: (gameCode: string, playerCode: string, playersCount?: number) => void;
};

export const Login = ({ existedGameCode, existedCode, onSubmit }: LoginProps) => {
    const [gameCode, setGameCode] = useState<string[]>(
        existedGameCode?.length === length ? existedGameCode : Array(length).fill(''),
    );
    const [playerCode, setPlayerCode] = useState(existedCode ?? '');
    const [isCodeChange, setIsCodeChange] = useState(!existedCode);
    const [playersCount, setPlayersCount] = useState(2);
    const [isNew, setIsNew] = useState(true);

    const inputsRef = useRef<any>([]);

    const handleChange = (index: number, value: string) => {
        if (/^[A-Za-z0-9]?$/.test(value)) {
            const updated = [...gameCode];
            updated[index] = value.toUpperCase();
            setGameCode(updated);

            if (value && index < length - 1) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: any) => {
        if (e.key === 'Backspace' && !gameCode[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e: any) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData('text')
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase();
        if (!pasteData) return;

        const updated = [...gameCode];
        for (let i = 0; i < length; i++) {
            updated[i] = pasteData[i] || '';
        }
        setGameCode(updated);

        const firstEmpty = updated.findIndex((char) => char === '');
        if (firstEmpty >= 0) {
            inputsRef.current[firstEmpty].focus();
        } else {
            inputsRef.current[length - 1].focus();
        }
    };

    const isGameCodeValid = gameCode.every((char) => char !== '');
    const isPlayerCodeValid = playerCode.length >= 3 && playerCode.length <= 30;
    const isPlayersCountValid = playersCount >= 1 && playersCount <= 5;

    const handleEnter = () => {
        if (!isGameCodeValid || !isPlayerCodeValid) {
            alert('Проверьте правильность заполнения полей');
            return;
        }

        onSubmit(gameCode.join(''), playerCode);
    };

    const handleNew = () => {
        if (!isPlayerCodeValid && !isPlayersCountValid) {
            alert('Проверьте правильность заполнения полей');
            return;
        }

        onSubmit(getRandomCode(), playerCode, playersCount);
    };

    return (
        <OverflowDialog
            triggerLabel={existedGameCode && existedCode ? `${existedGameCode.join('')} ${existedCode}` : 'Новая игра'}
            confirmComponent={(handleConfirm) =>
                isNew ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleNew();
                            handleConfirm();
                        }}
                        disabled={!isPlayerCodeValid || !isPlayersCountValid}
                    >
                        Создать игру
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleEnter();
                            handleConfirm();
                        }}
                        disabled={!isGameCodeValid || !isPlayerCodeValid}
                    >
                        Войти в игру
                    </Button>
                )
            }
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 400, margin: '0 auto' }}>
                {/* Код игры */}
                {!isNew && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Код игры
                        </Typography>
                        {gameCode.map((char, i) => (
                            <TextField
                                key={i}
                                value={char}
                                inputRef={(el) => (inputsRef.current[i] = el)}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                inputProps={{
                                    maxLength: 1,
                                    style: { textAlign: 'center', fontSize: 24, width: '40px' },
                                }}
                                sx={{
                                    backgroundColor: colors[i],
                                    margin: '2px',
                                    borderRadius: 1,
                                }}
                            />
                        ))}
                    </Box>
                )}

                {isCodeChange && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Ваше имя
                        </Typography>
                        <TextField
                            fullWidth
                            value={playerCode}
                            onChange={(e) => setPlayerCode(e.target.value)}
                            error={!isPlayerCodeValid && playerCode.length > 0}
                            helperText={!isPlayerCodeValid && playerCode.length > 0 ? 'От 3 до 30 символов' : ''}
                        />
                    </Box>
                )}

                {isNew && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Количество игроков
                        </Typography>
                        <ToggleButtonGroup
                            value={playersCount}
                            exclusive
                            onChange={(e, newVal) => {
                                if (newVal !== null) setPlayersCount(newVal);
                            }}
                            aria-label="select one option"
                            size="small"
                        >
                            {[1, 2, 3, 4, 5].map((opt, i) => (
                                <div
                                    key={opt}
                                    className="players-count-item"
                                    style={{
                                        backgroundColor: colors[i],
                                        width: opt === playersCount ? '38px' : '30px',
                                        height: opt === playersCount ? '38px' : '30px',
                                        margin: opt === playersCount ? '0 5px' : '5px',
                                    }}
                                    onClick={() => setPlayersCount(opt)}
                                >
                                    {opt}
                                </div>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                )}
                <Button variant="text" onClick={() => setIsNew((prev) => !prev)}>
                    {isNew ? 'Есть код? Войти в игру здесь' : 'Начать новую игру?'}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <Switch checked={isCodeChange} onChange={() => setIsCodeChange((prev) => !prev)} />
                    <Typography variant="subtitle1" gutterBottom>
                        Сменить имя
                    </Typography>
                </Box>
            </Box>
        </OverflowDialog>
    );
};
