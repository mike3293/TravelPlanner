import { links } from 'src/links';
import { authService } from 'src/config/services';

import { Credentials } from '../../organisms/Credentials';


export function Register() {
    return (
        <Credentials
            title='Register'
            label='Register'
            successRedirectLink={links.home}
            authentificateAsync={(...args) => authService.registerAsync(...args)}
        />
    );
};
