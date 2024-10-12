import { useState } from 'react';
import { Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddCircleOutline } from '@mui/icons-material';
import { AddDayForm } from './AddDayForm';

import styles from './AddDay.module.scss';


export interface AddDayProps {
    className?: string;
}

export function AddDay({ className }: AddDayProps) {
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
