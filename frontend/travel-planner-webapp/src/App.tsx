import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { theme } from './config/theme/theme';
import { PlannerContainer, Trips, TripDetails } from './components/pages/planner';
import { Register, LogIn } from './components/pages/auth';


export function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Navigate to='trips' replace />} />
                        <Route path='trips' element={<PlannerContainer />}>
                            <Route index element={<Trips />} />
                            <Route path=':tripId' element={<TripDetails />} />
                        </Route>
                        <Route path='register' element={<Register />} />
                        <Route path='login' element={<LogIn />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
            <ToastContainer />
        </>
    );
}
