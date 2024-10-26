import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';

import { usePointSelectionStoreShallow } from 'src/context/pointSelectionStore';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { ActivityForm } from '../../ActivityForm';

import styles from './EditActivity.module.scss';


export interface EditActivityProps {
    className?: string;
    activity: TripDayActivity;
    onEdit: (activity: TripDayActivity) => void;
}

export function EditActivity({ className, activity, onEdit }: EditActivityProps) {
    const [isPointRequested] = usePointSelectionStoreShallow(s => [s.isPointRequested]);

    const [isEditing, setIsEditing] = useState(false);

    return (
        <ActivityForm
            activity={activity}
            anchorEl={(
                <IconButton
                    className={classNames(className, styles.button)}
                    onClick={() => setIsEditing(true)}
                    disabled={isPointRequested}
                >
                    <Edit />
                </IconButton>
            )}
            onSubmit={onEdit}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
        />
    );
};
