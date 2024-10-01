import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { links } from './links';
import { theme } from './config/theme/theme';
import { Planner } from './components/pages/planner';
import { Register, LogIn } from './components/pages/auth';


export function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path={links.home} element={<Planner />} />
                        <Route path={links.register} element={<Register />} />
                        <Route path={links.login} element={<LogIn />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}
