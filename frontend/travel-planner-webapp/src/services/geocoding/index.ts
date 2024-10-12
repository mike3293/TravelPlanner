import { ServiceBase } from '../serviceBase';
import { GeoAddress } from './GeoAddress';


class GeocodingService extends ServiceBase {
    private readonly apiKey: string;


    constructor(baseUrl: string, apiKey: string) {
        super(baseUrl);
        this.apiKey = apiKey;
    }


    public getAddressAsync(lat: number, lon: number) {
        const params = {
            location_type: 'ROOFTOP',
            result_type: 'street_address',
            key: this.apiKey,
            latlng: `${lat},${lon}`,
        }

        return this.get<GeoAddress>('', undefined, params);
    }
}

export default GeocodingService;
