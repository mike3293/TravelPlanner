import { Autocomplete, TextField } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

import { useMutation } from 'src/components/hooks/useMutation';
import { geocodingService } from 'src/config/services';
import useOnDidUpdate from 'src/components/hooks/useOnDidUpdate';

import styles from './PlaceSearch.module.scss';
import { PointWithAddress } from 'src/context/pointSelectionStore/types';
import L from 'leaflet';
import { useOnDidMount } from 'src/components/hooks/useOnDidMount';


type Prediction = google.maps.places.AutocompletePrediction;

export interface PlaceSearchProps {
    requestedPoint: PointWithAddress | null;
    onSelect: (place: PointWithAddress) => void;
}

export function PlaceSearch({ requestedPoint, onSelect }: PlaceSearchProps) {
    const ref = useRef<HTMLElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [selectedOption, setSelectedOption] = useState<Prediction | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const { mutate } = useMutation((query: string) => geocodingService.getPlacesAsync(query), {
        onSuccess: (response) => {
            setPredictions(response.predictions);
        },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const search = useCallback(debounce((input: string) => {
        if (input.length > 2) {
            mutate(input);
        }
    }, 500), []);

    useOnDidUpdate(() => {
        search(inputValue);
    }, [inputValue]);

    useOnDidUpdate(() => {
        if (requestedPoint && requestedPoint?.address !== inputValue) {
            setSelectedOption({ description: requestedPoint.address, place_id: '' } as Prediction);
        }
    }, [requestedPoint?.address]);

    const handleInputChange = (_: unknown, value: string) => {
        setInputValue(value);
    };

    const handleSelection = async (_: unknown, value: Prediction | null) => {
        setSelectedOption(value);
        if (!value) {
            setPredictions([]);
            return;
        }
        const placeResult = await geocodingService.getPlaceDetailsAsync(value!.place_id);
        if (!placeResult) {
            throw new Error('Failed to get place details');
        }

        const location = placeResult.result.geometry?.location;
        if (!location) {
            throw new Error('Location is empty');
        }

        onSelect({ latitude: location.lat(), longitude: location.lng(), address: value.description });
    };

    useOnDidMount(() => {
        L.DomEvent.disableClickPropagation(ref.current!);
    });

    return (
        <Autocomplete
            ref={ref}
            className={styles.search}
            options={predictions}
            getOptionLabel={p => p.description}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            value={selectedOption}
            onChange={handleSelection}
            popupIcon={null}
            filterOptions={o => o}
            renderInput={(params) => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        className: styles.searchInput,
                    }}
                    className={styles.searchField}
                    placeholder='Search by address'
                    variant='outlined'
                />
            )}
        />
    );
};
