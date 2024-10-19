import { links } from 'src/links';
import { authService } from 'src/config/services';
import { RedirectAuthorized } from 'src/components/atoms/RedirectAuthorized';

import { Credentials } from '../../organisms/Credentials';


export function Register() {
    return (
        <RedirectAuthorized>
            <Credentials
                title='Register'
                label='Register'
                successRedirectLink={links.home}
                authentificateAsync={(...args) => authService.registerAsync(...args)}
            />
        </RedirectAuthorized>
    );
};
