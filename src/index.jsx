import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { PreferenceProvider } from './ContextProviders/PreferenceContext';
import { MetadataProvider } from './ContextProviders/MetadataContext';
import { SnackbarProvider } from 'notistack';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GoogleProvider>
      <MetadataProvider>
        <PreferenceProvider>
          <SnackbarProvider
            dense
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            preventDuplicate
          >
            <UserProvider>
              <App />
            </UserProvider>
          </SnackbarProvider>
        </PreferenceProvider>
      </MetadataProvider>
    </GoogleProvider>
  </React.StrictMode>
);
// these are no logic behind the order of encapsulation of the ContextProviders, they are sorted by alphabetical order
// except: `SnackbarProvider` should always be a parent of `UserContext` as the latter makes use of the former.