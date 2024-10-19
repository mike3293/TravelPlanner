import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { IntroStep, useIntroJourney } from 'src/components/moleculas/IntroJourney';

import { AddTripForm } from './AddTripForm';

import styles from './AddTrip.module.scss';


export interface AddTripProps {
    className?: string;
}

export function AddTrip() {
    const [isAdding, setIsAdding] = useState(false);

    const { nextStep } = useIntroJourney();

    return (
        <>
            <Card
                className={styles.card}
                data-intro-step={IntroStep.AddTrip}
                onClick={() => {
                    nextStep();
                    setIsAdding(true);
                }}
            >
                <CardContent className={styles.cardContent}>
                    <AddCircleOutline className={styles.cardIcon} />
                </CardContent>
            </Card>
            {isAdding && (
                <AddTripForm onClose={() => setIsAdding(false)} />
            )}
        </>
    );
};
