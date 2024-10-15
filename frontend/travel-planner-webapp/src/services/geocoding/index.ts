import { Loader } from '@googlemaps/js-api-loader';

import { ServiceResult } from '../serviceBase';


class GeocodingService {
    private readonly loader: Loader;

    constructor(apiKey: string) {
        this.loader = new Loader({
            apiKey: apiKey,
            version: 'quarterly',
        });
    }


    public async getAddressAsync(latitude: number, longitude: number) {
        try {
            const geocoder = await this.getGeocoderAsync();
            const result = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });

            return ServiceResult.createSuccessfull(result);
        } catch (error) {
            return ServiceResult.createUnsuccessfull<google.maps.GeocoderResponse>(`${error}`);
        }
    }

    public async getPlacesAsync(query: string) {
        try {
            const places = await this.getPlacesAutocompleteAsync();
            const result = await places.getPlacePredictions({ input: query });

            return ServiceResult.createSuccessfull(result);
        } catch (error) {
            return ServiceResult.createUnsuccessfull<google.maps.places.AutocompleteResponse>(`${error}`);
        }
    }

    public async getLocationAsync(query: string) {
        try {
            const places = await this.getGeocoderAsync();
            const result = await places.geocode({ address: query });

            return ServiceResult.createSuccessfull(result);
        } catch (error) {
            return ServiceResult.createUnsuccessfull<google.maps.GeocoderResponse>(`${error}`);
        }
    }

    public async getPlaceDetailsAsync(placeId: string) {
        try {
            const places = await this.getPlacesServiceAsync();
            const result = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
                places.getDetails({ placeId, fields: ['geometry'] }, (place, status) => {
                    if (status === 'OK') {
                        resolve(place!);
                    } else {
                        reject(status);
                    }
                });
            });

            return ServiceResult.createSuccessfull(result);
        } catch (error) {
            return ServiceResult.createUnsuccessfull<google.maps.places.PlaceResult>(`${error}`);
        }
    }


    private async getGeocoderAsync() {
        const geoLibrary = await this.loader.importLibrary('geocoding');

        return new geoLibrary.Geocoder();
    }

    private async getPlacesAutocompleteAsync() {
        const library = await this.loader.importLibrary('places');

        return new library.AutocompleteService();
    }

    private async getPlacesServiceAsync() {
        const library = await this.loader.importLibrary('places');

        return new library.PlacesService(document.createElement('div'));
    }
}

export default GeocodingService;
