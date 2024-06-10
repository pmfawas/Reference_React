/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

//TODO:Need to get ClientID, TenantID and ReturnURL from Azure AD

import { LogLevel } from "@azure/msal-browser";

const getClientId = (): string => {
    if (window.location.hostname.includes('qa.')) {
        return "5cd53e7f-1526-4276-821c-a59f519cee9a";
    } else {
        return "5cd53e7f-1526-4276-821c-a59f519cee9a";
    }
};

export const msalConfig = {
    auth: {
        clientId: getClientId(),
        authority: "https://login.microsoftonline.com/d45c09bf-0c49-49f6-978f-3347d549dadd",
        redirectUri: "https://localhost:44330",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        // console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["User.Read"]
};

const getPSElectionsApiScopes = (): string => {
    if (window.location.hostname.includes('qa.')) {
        return "https://PSElections-qa.cedwebapi.com/PSElections.All";
    } else {
        return "https://PSElections-dev.cedwebapi.com/PSElections.All";
    }
}

export const PSElectionsApiScopes = {
    scopes: [getPSElectionsApiScopes()]
};

export const coreApiRequest = {
    scopes: ["https://core-dev.cedwebapi.com/Core.Menu"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
