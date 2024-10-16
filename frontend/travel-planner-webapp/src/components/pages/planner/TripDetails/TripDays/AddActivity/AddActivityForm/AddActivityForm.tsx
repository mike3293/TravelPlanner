import { Close } from '@mui/icons-material';
import { Alert, Button, IconButton, TextField, Tooltip } from '@mui/material';
import { ReactNode } from 'react';
import classNames from 'classnames';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { useAddActivityForm } from './useAddActivityForm';

import styles from './AddActivityForm.module.scss';


export interface AddActivityFormProps {
    anchorEl: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (activity: TripDayActivity) => void;
}

export function AddActivityForm({ anchorEl, isOpen, onClose, onCreate }: AddActivityFormProps) {
    const {
        isMobile,
        popperRef,
        state,
        dispatch,
        handleClose,
        handleCreate,
    } = useAddActivityForm({ isOpen, onClose, onCreate });

    return (
        <Tooltip
            open={isOpen}
            classes={{
                popper: classNames(isMobile && styles.formMobile),
                tooltip: styles.form,
            }}
            PopperProps={{
                popperRef: popperRef,
                modifiers: [isMobile ? {
                    name: 'computeStyles',
                    options: {
                        gpuAcceleration: false,
                        adaptive: false,
                    }
                } : {}],
            }}
            title={(
                <>
                    <IconButton
                        className={styles.formClose}
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                    <TextField
                        variant='standard'
                        label='Name'
                        tabIndex={-1}
                        value={state.name}
                        onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                        fullWidth
                    />
                    {state.address ? (
                        <>{state.address}</>
                    ) : (
                        <Alert severity='warning' className={styles.formLocationWarning}>
                            Please select location on the map
                        </Alert>
                    )}
                    <Button
                        className={styles.formButton}
                        variant='contained'
                        color='primary'
                        onClick={handleCreate}
                        disabled={!state.address}
                    >
                        Create activity
                    </Button>
                </>
            )}
        >
            <div className={styles.anchor}>{anchorEl}</div>
        </Tooltip>
    );
};
