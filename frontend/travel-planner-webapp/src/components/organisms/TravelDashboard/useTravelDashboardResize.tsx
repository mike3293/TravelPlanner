import 'leaflet/dist/leaflet.css';
import debounce from 'lodash/debounce';
import { useCallback, useRef, useState } from 'react';

import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';
import { mapResizeEventEmitter } from 'src/components/utils/events';


export function useTravelDashboardResize() {
    const [leftPaneWidth, setLeftPaneWidth] = useState(1200);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleResize = useCallback(debounce(() => {
        mapResizeEventEmitter.publish();
    }, 450), []);

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

    return {
        containerRef,
        leftPaneWidth,
        isDragging,
        handleMouseDown,
        handleExpandLeftPane,
        handleExpandRightPane,
    };
};
