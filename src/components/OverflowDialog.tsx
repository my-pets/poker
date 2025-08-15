import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type OverflowDialogProps = {
    children: React.JSX.Element;
    triggerComponent?: () => React.JSX.Element;
    triggerLabel?: string;
    confirmComponent?: (handleConfirm: () => void) => React.JSX.Element;
    title?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isOpen?: boolean;
};

export const OverflowDialog = ({
    children,
    triggerComponent,
    confirmComponent,
    triggerLabel,
    title,
    onConfirm,
    onCancel,
    isOpen,
}: OverflowDialogProps) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleConfirm = () => {
        setOpen(false);
        onConfirm?.();
    };
    const handleCancel = () => {
        setOpen(false);
        onCancel?.();
    };

    useEffect(() => {
        if (typeof isOpen !== 'undefined') {
            setOpen(isOpen);
        }
    }, [isOpen]);

    return (
        <React.Fragment>
            {(!!triggerComponent || !!triggerLabel) && (
                <Button variant="text" color='inherit' onClick={handleClickOpen}>
                    {triggerComponent ? triggerComponent() : triggerLabel}
                </Button>
            )}
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    {!!onCancel && <Button onClick={handleCancel}>Отмена</Button>}
                    {!!onConfirm && (
                        <Button onClick={handleConfirm} autoFocus>
                            Сохранить
                        </Button>
                    )}
                    {!!confirmComponent && confirmComponent(handleConfirm)}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
