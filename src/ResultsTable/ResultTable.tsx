import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { ResultSell } from './ResultSell';

type ResultTableType = {
    table: (string | number)[][];
    saveCombination: (column: number, row: number) => void;
    combinations: (string | number)[];
    downIndex: number;
    upIndex: number;
};

const withBottomBorder = [6, 7, 18];

export const ResultTable = ({ table, saveCombination, combinations, downIndex, upIndex }: ResultTableType) => {
    return (
        <TableContainer sx={{ justifyItems: 'center', userSelect: 'none' }} tabIndex={-1}>
            <Table
                sx={{
                    width: 250,
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
            >
                <TableBody>
                    {table.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                borderBottom: withBottomBorder.includes(index)
                                    ? '1px solid rgba(224, 224, 224, 1)'
                                    : '1px solid rgb(60, 60, 60)',
                            }}
                        >
                            <ResultSell column={0} row={index} value={row[0]} />
                            <ResultSell
                                column={1}
                                row={index}
                                value={row[1]}
                                potentialCombination={downIndex === index ? combinations[index] : undefined}
                                saveCombination={downIndex === index ? saveCombination : undefined}
                            />
                            <ResultSell
                                column={2}
                                row={index}
                                value={row[2]}
                                potentialCombination={combinations[index]}
                                saveCombination={saveCombination}
                            />
                            <ResultSell
                                column={3}
                                row={index}
                                value={row[3]}
                                potentialCombination={upIndex === index ? combinations[index] : undefined}
                                saveCombination={upIndex === index ? saveCombination : undefined}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
