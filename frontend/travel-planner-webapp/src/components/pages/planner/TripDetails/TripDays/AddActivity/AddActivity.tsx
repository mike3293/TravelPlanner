import { useState } from 'react';
import { Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AddCircleOutline } from '@mui/icons-material';
import { AddActivityForm } from './AddActivityForm';

import styles from './AddActivity.module.scss';


export interface AddActivityProps {
    className?: string;
}

export function AddActivity({ className }: AddActivityProps) {
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
