import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { PreferenceProvider } from './ContextProviders/PreferenceContext';
import { NotificationProvider } from './ContextProviders/NotificationContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UserProvider>
      <GoogleProvider>
        <LinkProvider>
          <PreferenceProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </PreferenceProvider>
        </LinkProvider>
      </GoogleProvider>
    </UserProvider>
  </React.StrictMode>
);
