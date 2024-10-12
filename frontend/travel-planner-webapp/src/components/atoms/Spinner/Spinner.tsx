import { CircularProgress } from '@mui/material';

import styles from './Spinner.module.scss';


export function Spinner() {
    return (
        <div className={styles.spinnerWrapper}>
            <CircularProgress />
        </div>
    );
}