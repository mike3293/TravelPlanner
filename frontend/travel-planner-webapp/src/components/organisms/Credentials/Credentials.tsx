import { Container, Box, Typography, TextField, Alert, Button } from '@mui/material';
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';

import { validateEmail, validatePassword } from './utils';


type FormState = {
    email: string;
    password: string;
};

type FormAction = {
    type: 'change_email' | 'change_password';
    payload: string;
};

export const initialState: FormState = {
    email: '',
    password: '',
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'change_email':
            return { ...state, email: action.payload };
        case 'change_password':
            return { ...state, password: action.payload };
        default:
            return state;
    }
};

export interface CredentialsProps {
    title: string;
    label: string;
    successRedirectLink: string;
    authentificateAsync: (email: string, password: string) => Promise<boolean>;
    endAdornment?: React.ReactNode;
}

export function Credentials({ title, label, successRedirectLink, authentificateAsync, endAdornment }: CredentialsProps) {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(state.email)) {
            setError('Invalid email format.');
            return;
        }

        if (!validatePassword(state.password)) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const isSuccessful = await authentificateAsync(state.email, state.password);

        if (isSuccessful) {
            navigate(successRedirectLink);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Container maxWidth='xs'>
            <Box mt={8} display='flex' flexDirection='column' alignItems='center'>
                <Typography component='h1' variant='h5'>
                    {title}
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        label='Email'
                        type='email'
                        value={state.email}
                        onChange={(e) => dispatch({ type: 'change_email', payload: e.target.value })}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        label='Password'
                        type='password'
                        value={state.password}
                        onChange={(e) => dispatch({ type: 'change_password', payload: e.target.value })}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />
                    {error && <Alert severity='error'>{error}</Alert>}
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {label}
                    </Button>
                </form>
                {endAdornment}
            </Box>
        </Container>
    );
};
