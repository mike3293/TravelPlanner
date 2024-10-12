import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { AddDayForm } from './AddDayForm';

import styles from './AddDay.module.scss';


export interface AddDayProps {
    className?: string;
}

export function AddDay() {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <Card className={styles.card} onClick={() => setIsAdding(true)}>
                <CardContent className={styles.cardContent}>
                    <AddCircleOutline className={styles.cardIcon} />
                </CardContent>
            </Card>
            {isAdding && (
                <AddDayForm onClose={() => setIsAdding(false)} />
            )}
        </>
    );
};
