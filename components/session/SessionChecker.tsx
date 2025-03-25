'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function SessionChecker() {
    const { data: session } = useSession();
    const [lastActivity, setLastActivity] = useState(Date.now());
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH

    useEffect(() => {
        if (session) {
            const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

            if (!localStorage.getItem('sessionStartTime')) {
                localStorage.setItem('sessionStartTime', Date.now().toString());
            }

            const handleActivity = () => {
                setLastActivity(Date.now());
            };

            window.addEventListener('mousemove', handleActivity);
            window.addEventListener('keypress', handleActivity);
            window.addEventListener('click', handleActivity);
            window.addEventListener('scroll', handleActivity);

            const intervalId = setInterval(() => {
                const sessionStartTime = parseInt(localStorage.getItem('sessionStartTime') || '0');
                const now = Date.now();

                if (now - sessionStartTime >= SESSION_TIMEOUT) {
                    localStorage.removeItem('sessionStartTime');

                    signOut({ callbackUrl: `${basePath}/api/auth//signIn` });
                }
            }, 60000);

            return () => {
                clearInterval(intervalId);
                window.removeEventListener('mousemove', handleActivity);
                window.removeEventListener('keypress', handleActivity);
                window.removeEventListener('click', handleActivity);
                window.removeEventListener('scroll', handleActivity);
            };
        }
    }, [basePath, session]);

    return null;
}