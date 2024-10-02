import { createTheme } from '@mui/material/styles';
import { indigo, teal, blueGrey } from '@mui/material/colors';

export const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: indigo[200],  // Primary color set to indigo[200]
            light: indigo[100], // Lighter shade of primary
            dark: indigo[300],  // Darker shade of primary
        },
        secondary: {
            main: teal[200],    // Secondary color set to teal[200]
            light: teal[100],   // Lighter shade of secondary
            dark: teal[300],    // Darker shade of secondary
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
                    backgroundColor: indigo[300],  // Darker shade of primary for better contrast
                    '&:hover': {
                        backgroundColor: indigo[400], // Darker shade on hover
                    },
                    color: '#fff',  // Ensure text is readable on dark background
                },
                containedSecondary: {
                    backgroundColor: teal[300],    // Darker shade of secondary for better contrast
                    '&:hover': {
                        backgroundColor: teal[400],  // Darker shade on hover
                    },
                    color: '#fff',  // Ensure text is readable on dark background
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