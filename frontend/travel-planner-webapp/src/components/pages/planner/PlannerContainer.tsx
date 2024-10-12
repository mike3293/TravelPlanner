import { Outlet } from 'react-router-dom';

import { RedirectUnauthorized } from 'src/components/atoms/RedirectUnauthorized';
import { TravelDashboard } from 'src/components/organisms/TravelDashboard';


export function PlannerContainer() {
    return (
        <RedirectUnauthorized>
            <TravelDashboard>
                <Outlet />
            </TravelDashboard>
        </RedirectUnauthorized>
    );
};
