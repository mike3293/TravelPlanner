import { Alert, Button, Container, TextField, Typography } from '@mui/material';
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router';

import { useMutation } from 'src/components/hooks/useMutation';
import { ServiceResult } from 'src/services/serviceBase';

import { validateEmail, validatePassword } from './utils';

import styles from './Credentials.module.scss';


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
    authentificateAsync: (email: string, password: string) => Promise<ServiceResult>;
    endAdornment?: React.ReactNode;
}

export function Credentials({ title, label, successRedirectLink, authentificateAsync, endAdornment }: CredentialsProps) {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { mutate, isLoading } = useMutation(
        () => authentificateAsync(state.email, state.password),
        {
            onSuccess: () => {
                navigate(successRedirectLink);
            },
            onError: () => {
                setError('Invalid credentials. Please try again.');
            }
        }
    );

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(state.email)) {
            setError('Invalid email format.');
            return;
        }

        if (!validatePassword(state.password)) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        mutate();
    };

    return (
        <Container maxWidth='xs'>
            <div className={styles.credentials}>
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
                        className={styles.credentialsSubmit}
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {label}
                    </Button>
                </form>
                {endAdornment}
            </div>
        </Container>
    );
};
