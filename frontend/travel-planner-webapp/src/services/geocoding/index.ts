import { Loader } from '@googlemaps/js-api-loader';


class GeocodingService {
    private readonly loader: Loader;

    constructor(apiKey: string) {
        this.loader = new Loader({
            apiKey: apiKey,
            version: 'quarterly',
        });
    }


    public async getAddressAsync(latitude: number, longitude: number) {
        const geocoder = await this.getGeocoderAsync();
        const result = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
        // const params = {
        //     location_type: 'ROOFTOP',
        //     result_type: 'street_address',
        // }

        return result;
    }


    private async getGeocoderAsync() {
        const geoLibrary = await this.loader.importLibrary('geocoding');

        return new geoLibrary.Geocoder();
    }
}

export default GeocodingService;
