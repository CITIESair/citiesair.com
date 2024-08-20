# Account UI Components

### Overview

This folder contains UI components for account state management throughout CITIESair: Login and Logout

### Files

- [**Login.jsx**](./Login.jsx): 

  This component is used for its own page `/login` (found in [App.jsx](/src/App.jsx)):
  
  ![login-page](/documentation/login.png)

  It contains the classic trio `username`, `password`, and `rememeberMe` for schools to log in the CITIESair dashboard with the provided credentials. With the help of [UserContext.jsx](/src/ContextProviders/UserContext.jsx), it makes a `POST` to the backend server (api.citiesair.com) to authenticate the login attempt and handle the result appropriately:
    - Successful login: redirect the user to:
      - `redirectTo` if it is provided in the URL param, for example: https://citiesair.com/login?redirectTo=/dashboard/muna. This happens if the user is not logged in and they access a private page; subsequently, that page calls `useNavigate()` to point the user back to this `/login` page, with a URL param to navigate back to that page when logged in successfully.
      - `/dashboard` if no `redirectTo` is provided
    - Unsuccessful login: displays error message for the user to try again

      ![login-unsuccessful](/documentation/login-unsuccessful.png)

- [**Logout.jsx**](./Logout.jsx): 

  `Logout` is only a `MenuItem` component when the user hovers upon their account on the `Header`. Upon the user clicking `Logout`, it will send a `GET` request to the backend to remove the current session from the database. Upon logging out successfully, the application will return to the home page by calling `navigate('/')`.

  ![logout-popup](/documentation/logout.png)