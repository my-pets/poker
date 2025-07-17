import { Box, Button } from '@mui/material';
import { Dice } from './Dice';

type DicesType = {
    dices: number[];
    shakeHandler: () => void;
    savedDices: boolean[];
    onSaveDice: (i: number) => void;
    shakeCount: number;
};

export const Dices = ({ dices, shakeHandler, savedDices, onSaveDice, shakeCount }: DicesType) => {
    return (
        <>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                    width: 'fit-content',
                    height: '110px',
                    mx: 'auto',
                    placeItems: 'center',
                }}
            >
                <Dice index={0} dice={dices[0]} isSaved={savedDices[0]} onSaveDice={onSaveDice} />
                <Dice index={1} dice={dices[1]} isSaved={savedDices[1]} onSaveDice={onSaveDice} />
                <Dice index={2} dice={dices[2]} isSaved={savedDices[2]} onSaveDice={onSaveDice} />
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                    width: 'fit-content',
                    height: '110px',
                    mx: 'auto',
                    placeItems: 'center',
                }}
            >
                <Dice index={3} dice={dices[3]} isSaved={savedDices[3]} onSaveDice={onSaveDice} />
                <Dice index={4} dice={dices[4]} isSaved={savedDices[4]} onSaveDice={onSaveDice} />
            </Box>
            <Button onClick={shakeHandler} disabled={shakeCount === 3}>
                <div>Shake</div>
            </Button>
        </>
    );
};
