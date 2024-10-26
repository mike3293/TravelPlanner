import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';
import classNames from 'classnames';

import { useMobile } from 'src/components/hooks/useMedia';

import styles from './CardContainer.module.scss';


export interface CardContainerProps {
    title: string;
    name?: string | null;
    markerUrl: string;
    children?: ReactNode;
}

export function CardContainer({ title, name, markerUrl, children }: CardContainerProps) {
    const isMobile = useMobile();

    return (
        <Card className={classNames(styles.card, isMobile && styles.cardMobile)}>
            <CardContent className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderTitle}>
                        <Typography variant='h6'>{title}</Typography>
                        <img className={styles.cardHeaderTitleIcon} src={markerUrl} />
                    </div>
                    {name && <Typography>{name}</Typography>}
                </div>
                {children}
            </CardContent>
        </Card>
    );
};
