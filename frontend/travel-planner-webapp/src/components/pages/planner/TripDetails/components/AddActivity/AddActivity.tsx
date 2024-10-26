import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { IntroStep, useIntroJourney } from 'src/components/moleculas/IntroJourney';

import { ActivityForm } from '../ActivityForm';

import styles from './AddActivity.module.scss';


export interface AddActivityProps {
    className?: string;
    title?: string;
    onCreate: (activity: TripDayActivity) => void;
}

export function AddActivity({ className, title = 'Add activity', onCreate }: AddActivityProps) {
    const [isPointRequested] = usePointSelectionStoreShallow(s => [s.isPointRequested]);

    const [isAdding, setIsAdding] = useState(false);

    const { nextStep } = useIntroJourney();

    return (
        <ActivityForm
            anchorEl={(
                <Button
                    className={classNames(className, styles.add)}
                    data-intro-step={IntroStep.AddTripActivity}
                    onClick={() => {
                        nextStep();
                        setIsAdding(true);
                    }}
                    disabled={isPointRequested}
                >
                    <Add />
                    {title}
                </Button>
            )}
            onSubmit={onCreate}
            isOpen={isAdding}
            onClose={() => setIsAdding(false)}
        />
    );
};
