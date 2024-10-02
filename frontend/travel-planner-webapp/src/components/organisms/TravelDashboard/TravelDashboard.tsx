import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { IconButton } from '@mui/material';
import debounce from 'lodash/debounce';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TravelMap } from 'src/components/moleculas/TravelMap';
import { TravelPlanner } from 'src/components/moleculas/TravelPlanner';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';

import 'leaflet/dist/leaflet.css';
import styles from './TravelDashboard.module.scss';


export const TravelDashboard: React.FC = () => {
    const [leftPaneWidth, setLeftPaneWidth] = useState(1200);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleResize = useCallback(debounce(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, 600), []);

    useOnDidUpdate(() => {
        handleResize();
    }, [leftPaneWidth]);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftPaneWidth = e.clientX - containerRect.left;

        // Ensure the left pane doesn't get too large
        if (newLeftPaneWidth < containerRect.width) {
            setLeftPaneWidth(newLeftPaneWidth);
        }
    };

    const handleExpandLeftPane = () => {
        setLeftPaneWidth(containerRef.current?.offsetWidth ?? 0);
    };

    const handleExpandRightPane = () => {
        setLeftPaneWidth(0);
    };

    // Attach mousemove and mouseup listeners when dragging starts
    useOnDidUpdate(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={classNames(!isDragging && styles.transition)} style={{ width: `${leftPaneWidth}px` }}>
                <TravelPlanner />
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
                <TravelMap ref={mapRef} />
            </div>
        </div>
    );
};
