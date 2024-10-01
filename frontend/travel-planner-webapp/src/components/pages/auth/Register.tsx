import { links } from 'src/links';
import { Credentials } from '../../organisms/Credentials';
import { authService } from 'src/config/services';

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
