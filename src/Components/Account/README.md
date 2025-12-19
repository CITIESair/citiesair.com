# Account UI Components

> Login, logout, sign up, account verification, Google OAuth are here

**Summary of Functionalities**
- Two user types: Institution Admin (can access private dashboard) and Individual User (can only access public dashboard)
- Login is currently supported for both Institution Admin and Individual User. 
- Google OAuth is currently only supported for Individual User for login and signup 
- Signup is currently only for individual user to access public institutions like `NYUAD`. Institution Admin cannot create a new account (yet).
- Email verification is sent to Individual User upon signing up with an email-password combo. No further action is required if they signed up via Google OAuth.

### [UserTypeSelector.jsx](./UserTypeSelector.jsx): 
Used for both [Login.jsx](./Login.jsx) and [Signup.jsx](./Signup.jsx) to let users choose which type of user they want to be identified for the dashboard. There are two user types at the moment:
- Institution Admin: corresponds to `admin` and `school` in the backend. Has access to one or more private institution dashboards
- Individual User: corresponds to `individual` in the backend. Only has access to public institutions like `NYUAD` for setting personal email alerts or downloading raw data

### [Login.jsx](./Login.jsx) and [Signup.jsx](./Signup.jsx): 

![login-page](/documentation/login.png)
![signup-page](/documentation/signup.png)

`Login` contains the classic trio `username`, `password`, and `rememeberMe` for:
  - Institution Admins to log in with the provided credentials
  - or Individual Users to log in with their own chosen credentials (during signup)

`Signup` contains the classic trio `email`, `password`, and `confirmPassword`. `Signup` only works for Individual Users and not for Institution Admin

With [UserContext.jsx](/src/ContextProviders/UserContext.jsx), `Login`/`Signup` makes a `POST` to the backend server to authenticate the attempt:
  - Successful login: redirect the user to:
    - `redirect_url` if it is provided in the URL param, for example: https://citiesair.com/login?redirect_url=/dashboard/muna. This happens if the user is not logged in and they access a private page; subsequently, that page calls `useNavigate()` to point the user back to this `/login` page, with a URL param to navigate back to that page when logged in successfully.
    - `/dashboard` if no `redirect_url` is provided
  - Unsuccessful login: displays error message for the user to try again
    ![login-unsuccessful](/documentation/login-unsuccessful.png)

  - Successful signup: display a popup asking the user to check their email and click on the Verify Email link to finish the signup process. 
    ![verify-email](/documentation/verify-email.png)

    The user can still browse the dashboard if `is_verified === false`, but they cannot create alerts or download raw datasets until `is_verified === true`.
    ![verify-email-first](/documentation/verify-email-first.png)


### [Logout.jsx](./Logout.jsx): 

  `Logout` is only a `MenuItem` component when the user hovers upon their account on the `Header`. Upon the user clicking `Logout`, it will send a `GET` request to the backend to remove the current session from the database.. Upon logging out successfully (`204 OK`), the application will return to the home page by calling `navigate('/')`.

  ![logout-popup](/documentation/logout.png)

### [useLoginHandler.jsx](./useLoginHandler.jsx): 
Custom hook for components in [ProjectReservedArea.jsx](../../Pages/Project/ProjectReservedArea.jsx), such as [DatasetDownloadDialog.jsx](../DatasetDownload/DatasetDownloadDialog.jsx) and [AirQualityAlert.jsx](../AirQuality/AirQualityAlerts/AirQualityAlert.jsx) to restrict access to logged-in users.
  - Will open a Login popup if the user isn't logged in (no valid session cookie)
  - Allow access to such reserved areas if the user:
    - Is correctly authenticated
    - Has access to the requested institution
    - And `is_verified === true` (to enforce email verification)

`useLoginHandler` exposed `handleRestrictedAccess` that must be called by (dialog) components wishing to enforce this rule before actually openin the dialogs.

### [OAuth.jsx](./OAuth/): 
Currently, only Google OAuth is supported (but should already cover most use cases).

> Google OAuth enables Individual Users to log in or sign up using a Google account. Institution Admins are not supported via OAuth.

![google-oauth-popup](/documentation/google-oauth.png)

**Intended Functionalities**
- Implicit signup (if hasn't logged in via Google OAuth or didn't have an account before theen automatically create an account in backend)
- Authentication is treated as `is_verified === true`
- Results in a normal authenticated session, identical to password-based login

**Frontend ↔ Backend Interaction**
- After user consenting to log in via Google, the frontend receives an authorization code
- The code is sent to the backend OAuth endpoint (POST `/google/callback`) for authentication, user creation (if implicit signup) or user lookup, and session creation
- More detailed information about the OAuth flow, user handling, and Google Console configuration can be found in the backend documentation.