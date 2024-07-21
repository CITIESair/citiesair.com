import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { PreferenceProvider } from './ContextProviders/PreferenceContext';
import { NotificationProvider } from './ContextProviders/NotificationContext';
import { MetadataProvider } from './ContextProviders/MetadataContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GoogleProvider>
      <LinkProvider>
        <MetadataProvider>
          <NotificationProvider>
            <PreferenceProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </PreferenceProvider>
          </NotificationProvider>
        </MetadataProvider>
      </LinkProvider>
    </GoogleProvider>
  </React.StrictMode>
);
// these are no logic behind the order of encapsulation of the ContextProviders, they are sorted by alphabetical order
