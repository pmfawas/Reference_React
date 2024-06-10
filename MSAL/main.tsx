import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from './configs/authConfig.ts';

const pca = new PublicClientApplication(msalConfig);

async function initializeMsal() {
    await pca.initialize();
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App msalInstance={pca} />
        </React.StrictMode>,
    );
}

initializeMsal();
