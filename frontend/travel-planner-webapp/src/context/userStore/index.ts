import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IUserStore } from './types';


export const useUserStore = create<IUserStore>()(
    persist(
        (set) => ({
            accessToken: undefined,
            resetUser: () => {
                set({
                    accessToken: undefined,
                });
            },
        }),
        { name: 'user-storage' },
    ),
);