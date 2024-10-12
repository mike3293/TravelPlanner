import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import { AddActivityForm } from './AddActivityForm';

import styles from './AddActivity.module.scss';


export interface AddActivityProps {
    className?: string;
}

export function AddActivity() {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <Card className={styles.card} onClick={() => setIsAdding(true)}>
                <CardContent className={styles.cardContent}>
                    <AddCircleOutline className={styles.cardIcon} />
                </CardContent>
            </Card>
            {isAdding && (
                <AddActivityForm onClose={() => setIsAdding(false)} />
            )}
        </>
    );
};
