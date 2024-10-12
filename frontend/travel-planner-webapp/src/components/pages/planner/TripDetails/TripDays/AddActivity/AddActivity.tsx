import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRef, useState } from 'react';
import classNames from 'classnames';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';

import { AddActivityForm } from './AddActivityForm';

import styles from './AddActivity.module.scss';


export interface AddActivityProps {
    className?: string;
    onCreate: (activity: TripDayActivity) => void;
}

export function AddActivity({ className, onCreate }: AddActivityProps) {
    const isPointRequested = usePointSelectionStoreShallow(s => s.isPointRequested());

    const [isAdding, setIsAdding] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <Button
                ref={buttonRef}
                className={classNames(className, styles.add)}
                onClick={() => setIsAdding(true)}
                disabled={isPointRequested}
            >
                <Add />
                Add activity
            </Button>
            <AddActivityForm
                anchorEl={buttonRef.current!}
                onCreate={(a) => {
                    onCreate(a);
                    setIsAdding(false);
                }}
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
            />
        </>
    );
};
