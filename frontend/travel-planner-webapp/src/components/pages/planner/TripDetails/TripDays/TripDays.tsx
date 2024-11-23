import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { ReactNode } from 'react';

import { TripDay } from 'src/services/trips/TripDay';
import { getUniqueId } from 'src/components/utils/getUniqueId';
import { useMobile } from 'src/components/hooks/useMedia';

import { Activity } from '../components/Activity';
import { TripDayContainer } from './TripDayContainer';
import { AddActivity } from '../components/AddActivity';

import styles from './TripDays.module.scss';


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


export interface TripDaysProps {
    days: TripDay[];
    onDaysChange: (days: TripDay[]) => void;
    children?: ReactNode;
}

export function TripDays({ days, onDaysChange, children }: TripDaysProps) {
    const isMobile = useMobile();

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
            onDaysChange(newState);
        } else {
            const result = move(days.find(d => d.id === sInd)!.activities, days.find(d => d.id === dInd)!.activities, source, destination);
            const newState = [...days];
            newState.find(d => d.id === sInd)!.activities = result[sInd];
            newState.find(d => d.id === dInd)!.activities = result[dInd];

            onDaysChange(newState);
        }
    };

    return (
        <div className={classNames(styles.days, isMobile && styles.daysMobile)}>
            {children}
            <DragDropContext onDragEnd={onDragEnd}>
                {days.map((day, dayIndex) => (
                    <Droppable key={day.id} droppableId={day.id}>
                        {(provided: DroppableProvided) => (
                            <div
                                ref={provided.innerRef}
                                className={styles.daysDroppable}
                                {...provided.droppableProps}
                            >
                                <TripDayContainer day={day} index={dayIndex}>
                                    {day.activities.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided: DraggableProvided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Activity
                                                        activity={item}
                                                        indexes={{ dayIndex, index }}
                                                        onEdit={(activity) => {
                                                            const newState = [...days];
                                                            newState.find(d => d.id === day.id)!.activities[index] = activity;
                                                            onDaysChange(newState);
                                                        }}
                                                        onDelete={() => {
                                                            const newState = [...days];
                                                            newState.find(d => d.id === day.id)!.activities.splice(index, 1);
                                                            onDaysChange(newState);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <AddActivity
                                        onCreate={(activity) => {
                                            const newState = [...days];
                                            newState.find(d => d.id === day.id)!.activities.push({ ...activity, id: getUniqueId() });
                                            onDaysChange(newState);
                                        }}
                                    />
                                </TripDayContainer>
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    );
};
