import { useUserStore } from 'src/context/userStore';
import { AuthService } from 'src/services/auth';
import { TripsService } from 'src/services/trips';
import GeocodingService from 'src/services/geocoding';

import constants from './constants';


const authService = new AuthService(constants.API_URL, useUserStore);
const tripsService = new TripsService(constants.API_URL, useUserStore);
const geocodingService = new GeocodingService(constants.GEOCODER_API_KEY);

export {
    authService,
    tripsService,
    geocodingService,
}