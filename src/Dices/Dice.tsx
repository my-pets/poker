import { SvgIcon } from '@mui/material';
import { dicePics } from './dice-pics';
import CheckIcon from '@mui/icons-material/Check';

type DicesType = {
    index: number;
    dice: number;
    isSaved: boolean;
    onSaveDice: (i: number) => void;
};

export const Dice = ({ index, dice, isSaved, onSaveDice }: DicesType) => {
    return (
        <div onClick={() => onSaveDice(index)} style={{ width: '70px', height: '70px' }}>
            <SvgIcon
                viewBox="0 0 100 100"
                component={dicePics[index][dice - 1]}
                sx={{ width: '100%', height: '100%' }}
            />
            {isSaved && <CheckIcon />}
        </div>
    );
};
