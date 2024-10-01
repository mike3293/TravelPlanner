import { RedirectUnauthorized } from 'src/components/atoms/RedirectUnauthorized';
import { TravelMap } from 'src/components/organisms/TravelMap';

export function Planner() {
    return (
        <RedirectUnauthorized>
            <div>
                <h1>Travel Planner</h1>
                <p>Welcome to the Travel Planner page!</p>
                <TravelMap />
            </div>
        </RedirectUnauthorized>
    );
};
