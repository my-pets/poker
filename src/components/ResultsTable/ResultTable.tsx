import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { ResultSell } from './ResultSell';
import { CurrentPlayerInfo, PlayerEntity } from '../../socket/entities/player.entity';
import { socket } from '../../socket/socket';
import { TableCell, TableHead } from '@mui/material';

type ResultTableType = {
    isLables?: boolean;
    player: PlayerEntity;
    gameCode: string;
    currentOrder?: number;
    combinations?: number[];
};

const withBottomBorder = [5, 6, 17];

export const ResultTable = ({ player, isLables, combinations, gameCode, currentOrder }: ResultTableType) => {
    const { downIndex, upIndex } = player.currentPlayerInfo as CurrentPlayerInfo;
    const table = player.table;
    const isTurn = currentOrder === player.order;

    const onSaveCombination = (column: number, row: number) => {
        socket.emit('save-combination', {
            gameCode: gameCode,
            code: player.code,
            column,
            row,
        });
    };

    return (
        <Table
            sx={{
                width: isLables ? 280 : 210,
                justifyItems: 'center',
                alignItems: 'center',
                borderCollapse: 'collapse',
                '& td, & th': {
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    borderBottom: 'none',
                },
                '& td:first-child, & th:first-child': {
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                },
                userSelect: 'none',
            }}
            aria-label="simple table"
            size="small"
            tabIndex={-1}
            title={player.code}
        >
            <TableHead>
                <TableRow>
                    {isLables && <TableCell> </TableCell>}
                    <TableCell
                        colSpan={3}
                        align="center"
                        sx={{
                            color: '#d19bc8',
                            fontSize: '18px',
                            backgroundColor: isTurn ? '#4e2647' : undefined
                        }}>
                        {player.code}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {table?.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{
                            borderBottom: withBottomBorder.includes(index)
                                ? '1px solid rgba(224, 224, 224, 1)'
                                : '1px solid rgb(60, 60, 60)',
                            borderTop: index === 0 ? '1px solid rgba(224, 224, 224, 1)' : undefined
                        }}
                    >
                        {isLables && <ResultSell column={0} row={index} value={row[0]} />}
                        <ResultSell
                            column={1}
                            row={index}
                            value={row[1]}
                            potentialCombination={downIndex === index && isTurn ? combinations?.[index] : undefined}
                            saveCombination={downIndex === index && isTurn ? onSaveCombination : undefined}
                        />
                        <ResultSell
                            column={2}
                            row={index}
                            value={row[2]}
                            potentialCombination={isTurn ? combinations?.[index] : undefined}
                            saveCombination={isTurn ? onSaveCombination : undefined}
                        />
                        <ResultSell
                            column={3}
                            row={index}
                            value={row[3]}
                            potentialCombination={upIndex === index && isTurn ? combinations?.[index] : undefined}
                            saveCombination={upIndex === index && isTurn ? onSaveCombination : undefined}
                        />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
