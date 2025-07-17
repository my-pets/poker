import { useMemo } from 'react';
import './App.css';
import { Dices } from './Dices/Dices';
import { ResultTable } from './ResultsTable/ResultTable';
import { getRandomValue } from './get-random-value.helper';
import useLocalStorage from 'use-local-storage';
import { Box, Button } from '@mui/material';
import { countPossibleCombinations } from './ResultsTable/count-possible-combinations';

const EMPTY_DICES = [1, 1, 1, 1, 1];
const EMPTY_SAVED_DEICES = [false, false, false, false, false];
const DEFAULT_DOWN_INDEX = 1;
const DEFAULT_UP_INDEX = 18;

const emptyTable = [
    ['', '', '', ''],
    ['1', '', '', ''],
    ['2', '', '', ''],
    ['3', '', '', ''],
    ['4', '', '', ''],
    ['5', '', '', ''],
    ['6', '', '', ''],
    ['', '', '', ''],
    ['p', '', '', ''],
    ['2p', '', '', ''],
    ['▵', '', '', ''],
    ['□', '', '', ''],
    ['F', '', '', ''],
    ['Ms', '', '', ''],
    ['Bs', '', '', ''],
    ['Th', '', '', ''],
    ['N', '', '', ''],
    ['S', '', '', ''],
    ['P', '', '', ''],
    ['', '', '', ''],
];

function App() {
    const [dices, setDices] = useLocalStorage('dices', EMPTY_DICES);
    const [shakeCount, setShakeCount] = useLocalStorage('shakeCount', 0);
    const [savedDices, setSavedDices] = useLocalStorage('savedDices', EMPTY_SAVED_DEICES);
    const [table, setTable] = useLocalStorage('table', emptyTable);
    const [downIndex, setDownIndex] = useLocalStorage('downIndex', DEFAULT_DOWN_INDEX);
    const [upIndex, setUpIndex] = useLocalStorage('upIndex', DEFAULT_UP_INDEX);
    const [combsNumber, setCombsNumber] = useLocalStorage('combsNumber', 0);

    const onShake = () => {
        setShakeCount((prev) => (prev ?? 0) + 1);
        setDices(
            dices.map((dice, i) => {
                return savedDices[i] ? dice : getRandomValue();
            }),
        );
    };

    const onSaveDice = (savedI: number) => {
        if (shakeCount === 0) return;
        if (dices[savedI] === 0) return;
        setSavedDices((prev) => prev?.map((savedDice, index) => (savedI === index ? !savedDice : savedDice)));
    };

    const onNewGame = () => {
        setSavedDices(EMPTY_SAVED_DEICES);
        setShakeCount(0);
        setDices(EMPTY_DICES);
        setTable(emptyTable);
        setDownIndex(DEFAULT_DOWN_INDEX);
        setUpIndex(DEFAULT_UP_INDEX);
        setCombsNumber(0);
    };

    const combinations = useMemo(() => {
        if (!shakeCount) {
            return [];
        }
        return countPossibleCombinations(dices, shakeCount === 1);
    }, [dices, shakeCount]);

    const saveCombination = (column: number, row: number) => {
        const newTable = table.map((comb, i) =>
            comb.map((cell, j) => {
                if (i === row && j === column) {
                    return combinations[row].toString();
                }
                return cell;
            }),
        );

        if (row <= 6) {
            const currentSchool: string[] = [];
            for (let i = 1; i <= 6; i += 1) {
                currentSchool.push(newTable[i][column]);
            }
            if (!currentSchool.some((val) => val === '')) {
                let sum = currentSchool.reduce((acc, curr) => acc + Number(curr), 0);
                if (sum > 0) {
                    sum += 50;
                } else if (sum < 0) {
                    sum -= 50;
                }
                newTable[7][column] = sum.toString();
            }
        }

        if (combsNumber === 50) {
            let sums = [0, 0, 0];
            for (let i = 7; i <= 18; i += 1) {
                sums[0] += Number(newTable[i][1]);
                sums[1] += Number(newTable[i][2]);
                sums[2] += Number(newTable[i][3]);
            }

            newTable[19][1] = sums[0].toString();
            newTable[19][2] = sums[1].toString();
            newTable[19][3] = sums[2].toString();

            newTable[19][0] = (sums[0] + sums[1] + sums[2]).toString();
        } else {
            setShakeCount(0);
        }
        setTable(newTable);

        if (column === 1) {
            let downTo = 1;
            if (row === 6) {
                downTo += 1;
            }
            setDownIndex((prev) => (prev ?? DEFAULT_DOWN_INDEX) + downTo);
        }
        if (column === 3) {
            let upTo = 1;
            if (row === 8) {
                upTo += 1;
            }
            setUpIndex((prev) => (prev ?? DEFAULT_UP_INDEX) - upTo);
        }

        setCombsNumber((prev) => (prev ?? 0) + 1);
        setSavedDices(EMPTY_SAVED_DEICES);
    };

    return (
        <div className="App">
            <Button onClick={onNewGame}>
                <div>New Game</div>
            </Button>
            <Box sx={{ userSelect: 'none' }}>Current shake: {shakeCount}</Box>
            <Dices
                dices={dices}
                shakeHandler={onShake}
                savedDices={savedDices}
                onSaveDice={onSaveDice}
                shakeCount={shakeCount}
            />
            <ResultTable
                table={table}
                saveCombination={saveCombination}
                combinations={combinations}
                downIndex={downIndex}
                upIndex={upIndex}
            />
        </div>
    );
}

export default App;
