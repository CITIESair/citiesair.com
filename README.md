# CITIESair

### Local Development
If you want this frontend application to make API request to the production backend API (api.citiesair.com)
```
npm run start
```

Or, if you want this frontend application to make API request to the locally hosted backend API (localhost://3001). This command set `REACT_APP_ENV=local-backend` so that the app can bypass authorization.
```
npm run start-local-backend
```

More information on the backend can be found in this repo: [CITIESair-server](https://github.com/CITIESair/citiesair-server)