import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import AppRoutes from './AppRoutes';
import { AuthChecker } from './auth/AuthChecker';
import './App.css';
import './custom.css';

type AppProps = {
    msalInstance: IPublicClientApplication;
};

const App: React.FC<AppProps> = ({ msalInstance }) => {
    return (
        <div>
            <MsalProvider instance={msalInstance}>
                <AuthChecker>
                    <BrowserRouter>
                        <Routes>
                            {AppRoutes.map((route, index) => {
                                const { element, ...rest } = route;
                                return <Route key={index} {...rest} element={element} />;
                            })}
                        </Routes>
                    </BrowserRouter>
                </AuthChecker>
            </MsalProvider>
        </div>
    );
};

export default App;
