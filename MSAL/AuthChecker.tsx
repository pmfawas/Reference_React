import React, { useState, useEffect, ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo, EventType } from '@azure/msal-browser';
import { CircularProgress, Box, Typography } from '@mui/material';
import { loginRequest } from '../configs/authConfig';

interface AuthCheckerProps {
    children: ReactNode;
}

export const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authInProgress, setAuthInProgress] = useState(false);

    useEffect(() => {
        const initiateLoginRedirect = () => {
            sessionStorage.setItem('returnUrl', window.location.href);
            instance.loginRedirect(loginRequest).catch(authError => {
                console.error("Error during loginRedirect:", authError);
                setIsAuthenticating(false);
                setAuthInProgress(false);
            });
        };

        if (!isAuthenticated && !authInProgress) {
            setAuthInProgress(true);
            const accounts: AccountInfo[] = instance.getAllAccounts();

            if (accounts.length > 0) {
                instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] }).then(() => {
                    setAuthInProgress(false);
                }).catch(error => {
                    console.error("Error during silent refresh:", error);
                    setIsAuthenticating(true);
                    initiateLoginRedirect();
                });
            } else {
                setIsAuthenticating(true);
                initiateLoginRedirect();
            }
        }
    }, [isAuthenticated, authInProgress, instance]);

    useEffect(() => {
        const handleMsalEvents = () => {
            const eventCallbackId = instance.addEventCallback((event) => {
                if (event.eventType === EventType.LOGIN_START || event.eventType === EventType.ACQUIRE_TOKEN_START) {
                    setAuthInProgress(true);
                } else if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
                    setAuthInProgress(false);
                    setIsAuthenticating(false);
                    instance.removeEventCallback(eventCallbackId!);
                }
            });
        };

        handleMsalEvents();
    }, [instance]);

    if (!isAuthenticated || isAuthenticating) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="subtitle1" sx={{ marginTop: 2, textAlign: 'center' }}>
                    Authenticating...
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
};
