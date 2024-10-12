import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { tripsService } from 'src/config/services';
import { useQuery } from 'src/components/hooks/useQuery';
import { Spinner } from 'src/components/atoms/Spinner';

import styles from './TripDays.module.scss';
import { DateFormat } from 'src/config/dateFormats';
import { Moment } from 'moment';
import { memo, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { Trip } from 'src/services/trips/Trip';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { TripDay } from 'src/services/trips/TripDay';
import { Activity } from './Activity';
import { TripDayContainer } from './TripDayContainer';
import { AddDay } from './AddDay';
import { AddActivity } from './AddActivity';


const reorder = (
    list: TripDay['activities'],
    startIndex: number,
    endIndex: number
): TripDay['activities'] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
    source: TripDay['activities'],
    destination: TripDay['activities'],
    droppableSource: { index: number; droppableId: string },
    droppableDestination: { index: number; droppableId: string }
): { [key: string]: TripDay['activities'] } => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: TripDay['activities'] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: React.CSSProperties | undefined
): React.CSSProperties => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});


export interface TripDaysProps {
    days: TripDay[];
    setDays: (days: TripDay[]) => void;
}

export function TripDays({ days, setDays }: TripDaysProps) {
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = source.droppableId;
        const dInd = destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(days.find(d => d.id === sInd)!.activities, source.index, destination.index);
            const newState = [...days];
            newState.find(d => d.id === sInd)!.activities = items;
            setDays(newState);
        } else {
            const result = move(days.find(d => d.id === sInd)!.activities, days.find(d => d.id === dInd)!.activities, source, destination);
            const newState = [...days];
            newState.find(d => d.id === sInd)!.activities = result[sInd];
            newState.find(d => d.id === dInd)!.activities = result[dInd];

            setDays(newState);
        }
    };

    return (
        <div className={styles.days}>
            <DragDropContext onDragEnd={onDragEnd}>
                {days.map((day, ind) => (
                    <Droppable key={day.id} droppableId={day.id}>
                        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                            <div
                                ref={provided.innerRef}
                                // style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                            >
                                <TripDayContainer day={day}>
                                    {day.activities.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                // style={getItemStyle(
                                                //     snapshot.isDragging,
                                                //     provided.draggableProps.style
                                                // )}
                                                >
                                                    <Activity
                                                        activity={item}
                                                        onDelete={() => {
                                                            const newState = [...days];
                                                            newState.find(d => d.id === day.id)!.activities.splice(index, 1);
                                                            setDays(newState);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {/* <AddActivity /> */}
                                    {provided.placeholder}
                                </TripDayContainer>
                            </div>
                        )}
                    </Droppable>
                ))}
                {/* <AddDay /> */}
            </DragDropContext>
        </div>
    );
};
