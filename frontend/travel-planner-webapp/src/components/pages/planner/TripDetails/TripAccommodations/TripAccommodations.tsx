import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';

import { TripDay } from 'src/services/trips/TripDay';
import { getUniqueId } from 'src/components/utils/getUniqueId';
import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { getAccomodationMarkerUrl } from 'src/components/utils/getMarkerUrl';
import { useMobile } from 'src/components/hooks/useMedia';

import { CardContainer } from '../components/CardContainer';
import { Activity } from '../components/Activity';
import { AddActivity } from '../components/AddActivity';

import styles from './TripAccommodations.module.scss';


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


export interface TripAccommodationsProps {
    accommodations: TripDayActivity[];
    onChange: (accommodations: TripDayActivity[]) => void;
}

export function TripAccommodations({ accommodations, onChange }: TripAccommodationsProps) {
    const isMobile = useMobile();

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const items = reorder(accommodations, source.index, destination.index);
        const newState = [...items];
        onChange(newState);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='accommodations'>
                {(provided: DroppableProvided) => (
                    <div
                        ref={provided.innerRef}
                        className={classNames(isMobile && styles.droppableMobile)}
                        {...provided.droppableProps}
                    >
                        <CardContainer
                            title='Accommodations'
                            markerUrl={getAccomodationMarkerUrl()}
                        >
                            {accommodations.map((item, index) => (
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
                                                onEdit={(activity) => {
                                                    const newState = [...accommodations];
                                                    newState[index] = activity;
                                                    onChange(newState);
                                                }}
                                                onDelete={() => {
                                                    const newState = [...accommodations];
                                                    newState.splice(index, 1);
                                                    onChange(newState);
                                                }}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <AddActivity
                                title='Add accommodation'
                                onCreate={(activity) => {
                                    const newState = [...accommodations, { ...activity, id: getUniqueId() }];
                                    onChange(newState);
                                }}
                            />
                        </CardContainer>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
