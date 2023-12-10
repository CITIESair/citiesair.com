import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { RawDatasetsMetadataProvider } from './ContextProviders/RawDatasetsMetadataContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <GoogleProvider>
        <RawDatasetsMetadataProvider>
          <LinkProvider>
            <App />
          </LinkProvider>
        </RawDatasetsMetadataProvider>
      </GoogleProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
