import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { AddActivityForm } from './AddActivityForm';

import styles from './AddActivity.module.scss';


export interface AddActivityProps {
    className?: string;
    onCreate: (activity: TripDayActivity) => void;
}

export function AddActivity({ className, onCreate }: AddActivityProps) {
    const [isPointRequested] = usePointSelectionStoreShallow(s => [s.isPointRequested]);

    const [isAdding, setIsAdding] = useState(false);

    return (
        <AddActivityForm
            anchorEl={(
                <Button
                    className={classNames(className, styles.add)}
                    onClick={() => setIsAdding(true)}
                    disabled={isPointRequested}
                >
                    <Add />
                    Add activity
                </Button>
            )}
            onCreate={onCreate}
            isOpen={isAdding}
            onClose={() => setIsAdding(false)}
        />
    );
};
