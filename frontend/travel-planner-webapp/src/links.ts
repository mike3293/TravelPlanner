export const links = {
    home: '/',
    trips: '/trips',
    tripDetails: (id: string) => `/trips/${id}`,
    register: '/register',
    login: '/login',
} as const;