import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { links } from 'src/links';
import { authService } from 'src/config/services';

import { Credentials } from '../../organisms/Credentials';


export function LogIn() {
    return (
        <Credentials
            title='Log In'
            label='Log In'
            successRedirectLink={links.home}
            authentificateAsync={(...args) => authService.loginAsync(...args)}
            endAdornment={(
                <Typography variant='body2' sx={{ mt: 2 }}>
                    Don&apos;t have an account?{' '}
                    <Link to={links.register}>
                        Register here
                    </Link>
                </Typography>
            )}
        />
    );
};
