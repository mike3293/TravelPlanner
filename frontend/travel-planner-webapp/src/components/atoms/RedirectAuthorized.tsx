import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from 'src/context/userStore';
import { links } from 'src/links';


export function RedirectAuthorized({ children }: PropsWithChildren) {
    const navigate = useNavigate();

    const isAuthenticated = useUserStore(s => !!s.accessToken);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(links.home, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
