import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { UserProvider } from './ContextProviders/UserContext';
import { GoogleProvider } from './ContextProviders/GoogleContext';
import { LinkProvider } from './ContextProviders/LinkContext';
import { CommentCountsProvider } from './ContextProviders/CommentCountsContext';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <GoogleProvider>
        <CommentCountsProvider>
          <LinkProvider>
            <App />
          </LinkProvider>
        </CommentCountsProvider>
      </GoogleProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
