import { useUserStore } from 'src/context/userStore';
import { AuthService } from 'src/services/auth';
import { TripsService } from 'src/services/trips';

import constants from './constants';


const authService = new AuthService(constants.API_URL, useUserStore);
const tripsService = new TripsService(constants.API_URL, useUserStore);

export {
    authService,
    tripsService,
}