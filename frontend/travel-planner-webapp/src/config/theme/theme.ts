import { createTheme } from '@mui/material/styles';
import { indigo, teal, blueGrey } from '@mui/material/colors';

const headerStyles = {
    textShadow: '1px 3px 2px var(--mui-palette-grey-400)',
    fontWeight: 700,
}

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
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: 14,
        h1: headerStyles,
        h2: headerStyles,
        h3: headerStyles,
        h4: headerStyles,
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
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                },
            },
        },
    },
});