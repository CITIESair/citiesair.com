import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { HomePageProvider } from './ContextProviders/HomePageContext';
import { TabProvider } from './ContextProviders/TabContext';
import { RawDatasetsMetadataProvider } from './ContextProviders/RawDatasetsMetadataContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <GoogleProvider>
        <HomePageProvider>
          <RawDatasetsMetadataProvider>
            <LinkProvider>
              <TabProvider>
                <App />
              </TabProvider>
            </LinkProvider>
          </RawDatasetsMetadataProvider>
        </HomePageProvider>
      </GoogleProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
