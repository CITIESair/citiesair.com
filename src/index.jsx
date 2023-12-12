import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { RawDatasetsMetadataProvider } from './ContextProviders/RawDatasetsMetadataContext';
import { CommentCountsProvider } from './ContextProviders/CommentCountsContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <GoogleProvider>
        <CommentCountsProvider>
          <RawDatasetsMetadataProvider>
            <LinkProvider>
              <App />
            </LinkProvider>
          </RawDatasetsMetadataProvider>
        </CommentCountsProvider>
      </GoogleProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
