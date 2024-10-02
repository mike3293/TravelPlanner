import { RedirectUnauthorized } from 'src/components/atoms/RedirectUnauthorized';
import { TravelDashboard } from 'src/components/organisms/TravelDashboard';

export function Planner() {
    return (
        <RedirectUnauthorized>
            <TravelDashboard />
        </RedirectUnauthorized>
    );
};
