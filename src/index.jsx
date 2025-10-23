import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { PreferenceProvider } from './ContextProviders/PreferenceContext';
import { MetadataProvider } from './ContextProviders/MetadataContext';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient();

// Use localStorage as persistence
const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

// use frontend api caching for production
const IS_PRODUCTION = process.env.REACT_APP_ENV === 'production';

const Providers = ({ children }) => (
  <GoogleProvider>
    <MetadataProvider>
      <PreferenceProvider>
        <SnackbarProvider
          dense
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          preventDuplicate
        >
          <UserProvider>{children}</UserProvider>
        </SnackbarProvider>
      </PreferenceProvider>
    </MetadataProvider>
  </GoogleProvider>
);

root.render(
  <React.StrictMode>
    {IS_PRODUCTION ? (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: localStoragePersister }}
      >
        <Providers>
          <App />
        </Providers>
      </PersistQueryClientProvider>
    ) : (
      <QueryClientProvider client={queryClient}>
        <Providers>
          <App />
        </Providers>
      </QueryClientProvider>
    )}
  </React.StrictMode>
);

// `SnackbarProvider` should always be a parent of `UserContext` as the latter makes use of the former.
