import { Box, Button } from '@mui/material';
import TableCell from '@mui/material/TableCell';

type ResultSellType = {
    column: number;
    row: number;
    value: number | string;
    potentialCombination?: number | string;
    saveCombination?: (column: number, row: number) => void;
};

export const ResultSell = ({ column, row, value, potentialCombination, saveCombination }: ResultSellType) => {
    const onClickCombination = () => {
        saveCombination?.(column, row);
    };

    const isPotentianal = value === '' && (potentialCombination || potentialCombination === 0);

    return (
        <TableCell
            align="center"
            padding="none"
            sx={{
                justifyItems: 'center',
                height: 20,
                width: 20,
            }}
        >
            {!isPotentianal && (
                <Box
                    sx={{
                        color: '#d19bc8',
                        justifyItems: 'center',
                        height: 20,
                        width: 20,
                    }}
                >
                    {value === '0' ? 'X' : value}
                </Box>
            )}
            {!!isPotentianal && (
                <Button
                    color="primary"
                    onClick={onClickCombination}
                    sx={{
                        height: 10,
                        width: 10,
                        minWidth: 10,
                        padding: 0,
                    }}
                >
                    {potentialCombination}
                </Button>
            )}
        </TableCell>
    );
};
