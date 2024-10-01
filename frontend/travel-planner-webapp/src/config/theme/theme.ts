import { createTheme } from '@mui/material/styles';
import { blueGrey, teal, amber } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: teal[500],
            light: teal[300],
            dark: teal[700],
        },
        secondary: {
            main: amber[500],
            light: amber[300],
            dark: amber[700],
        },
        background: {
            default: blueGrey[900],
            paper: blueGrey[800],
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: 14,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: 16,
                },
                containedPrimary: {
                    backgroundColor: teal[600],
                    '&:hover': {
                        backgroundColor: teal[800],
                    },
                },
                containedSecondary: {
                    backgroundColor: amber[600],
                    '&:hover': {
                        backgroundColor: amber[800],
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: blueGrey[800],
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: blueGrey[800],
                    color: '#ffffff',
                },
            },
        },
    },
});
