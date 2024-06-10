import { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { AccountInfo} from "@azure/msal-browser";
import { PSElectionsApiScopes } from '../configs/authConfig';

interface AuthToken {
    token: string | null;
    error: Error | null;
}

const useAuthToken = (): AuthToken => {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const { instance, accounts } = useMsal();

    const fetchToken = async () => {
        if (accounts.length > 0) {
            try {
                const response = await instance.acquireTokenSilent({
                    ...PSElectionsApiScopes,
                    account: accounts[0] as AccountInfo,
                });
                setToken(response.accessToken);
            } catch (err) {
                setError(error);
                console.error('Error Acquiring Authentication Token', err);
            }
        }
    };

    useEffect(() => {
        fetchToken();
    }, [instance, accounts,error]);

    return { token, error };
};

export default useAuthToken;
