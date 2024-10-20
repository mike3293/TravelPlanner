import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider } from 'react-query';
import moment from 'moment';
import 'moment-timezone';

import { theme } from './config/theme/theme';
import { PlannerContainer, Trips, TripDetails } from './components/pages/planner';
import { Register, LogIn } from './components/pages/auth';


moment.tz.setDefault('Atlantic/Reykjavik');
moment.updateLocale('en', { week: { dow: 1 } });


const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
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
            </LocalizationProvider>
        </QueryClientProvider>
    );
}
