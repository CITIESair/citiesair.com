import React, { type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { PreferenceProvider } from './ContextProviders/PreferenceContext';
import { MetadataProvider } from './ContextProviders/[Deprecated]_CommentContext';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { NetworkStatusProvider } from './ContextProviders/NetworkStatusContext';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root not found');
}

const root = createRoot(container);

const queryClient = new QueryClient();

// Use localStorage as persistence
const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

// use frontend api caching for production
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === 'production';

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => (
  <SnackbarProvider
    dense
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    preventDuplicate
  >
    <NetworkStatusProvider>
      <GoogleProvider>
        <MetadataProvider>
          <PreferenceProvider>
            <UserProvider>{children}</UserProvider>
          </PreferenceProvider>
        </MetadataProvider>
      </GoogleProvider>
    </NetworkStatusProvider>
  </SnackbarProvider>
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

// `SnackbarProvider` should always be a parent of `NetworkStatusProvider` `UserProvider` as the latter makes use of the former.