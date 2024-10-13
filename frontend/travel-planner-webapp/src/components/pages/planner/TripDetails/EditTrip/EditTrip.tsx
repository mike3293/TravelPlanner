import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { Trip } from 'src/services/trips/Trip';

import { EditTripForm } from './EditTripForm';

import styles from './EditTrip.module.scss';


export interface EditTripProps {
    trip: Trip;
}

export function EditTrip({ trip }: EditTripProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <IconButton
                className={styles.edit}
                onClick={() => setIsEditing(true)}
            >
                <Edit />
            </IconButton>
            {isEditing && (
                <EditTripForm
                    trip={trip}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};
