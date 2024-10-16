import { Close } from '@mui/icons-material';
import { Alert, Button, IconButton, TextField, Tooltip } from '@mui/material';
import { ReactNode } from 'react';
import classNames from 'classnames';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { useActivityForm } from './useActivityForm';

import styles from './ActivityForm.module.scss';


export interface ActivityFormProps {
    activity?: TripDayActivity;
    anchorEl: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (activity: TripDayActivity) => void;
}

export function ActivityForm({
    activity,
    anchorEl,
    isOpen,
    onClose,
    onSubmit,
}: ActivityFormProps) {
    const {
        isMobile,
        popperRef,
        state,
        dispatch,
        handleClose,
        handleSave,
    } = useActivityForm({ activity, isOpen, onClose, onSubmit });

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
                        onClick={() => handleClose()}
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
                        onClick={handleSave}
                        disabled={!state.address}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <div className={styles.anchor}>{anchorEl}</div>
        </Tooltip>
    );
};
