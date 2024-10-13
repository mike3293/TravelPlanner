import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

import { TravelMap } from 'src/components/moleculas/TravelMap';

import { useTravelDashboardResize } from './useTravelDashboardResize';

import styles from './TravelDashboard.module.scss';


export function TravelDashboard({ children }: PropsWithChildren) {
    const {
        leftPaneWidth,
        isDragging,
        handleMouseDown,
        handleExpandRightPane,
        handleExpandLeftPane,
        containerRef,
    } = useTravelDashboardResize();

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={classNames(styles.leftPane, !isDragging && styles.transition)} style={{ width: `${leftPaneWidth}px` }}>
                <div className={styles.childContainer}>
                    {children}
                </div>
            </div>
            <div className={styles.separator} onMouseDown={handleMouseDown}>
                <IconButton
                    onClick={handleExpandRightPane}
                    onMouseDown={e => e.stopPropagation()}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton
                    onClick={handleExpandLeftPane}
                    onMouseDown={e => e.stopPropagation()}
                >
                    <ChevronRight />
                </IconButton>
            </div>
            <div className={classNames(!isDragging && styles.transition)} style={{ width: `calc(100% - ${leftPaneWidth + 40}px)` }}>
                <TravelMap />
            </div>
        </div>
    );
};
