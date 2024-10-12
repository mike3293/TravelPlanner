import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { AddTripForm } from './AddTripForm';

import styles from './AddTrip.module.scss';


export interface AddTripProps {
    className?: string;
}

export function AddTrip() {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <Card className={styles.card} onClick={() => setIsAdding(true)}>
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
