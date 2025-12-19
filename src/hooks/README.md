# Hooks

**Except for:**
- [UserContext](/src/ContextProviders/UserContext.jsx)
- [Login](/src/Components/Account/Login.jsx), [Logout](/src/Components/Account/Logout.jsx), [Account Verify](/src/Components/Account/Verify.jsx), [Signup](/src/Components/Account/Signup.jsx)
- [GoogleOAuthCallback](/src/Components/Account/OAuth/GoogleOAuthCallback.jsx)
- [Alerts Unsubcribe](/src/Pages/UnsubscribeAlert.jsx)

...all data fetches in CITIESair uses **custom React Query hooks** for fetching and mutating server-side data. These hooks provide a consistent interface for retrieving real-time air quality measurements, alerts, school metadata, and user-related information.


### How It Works

Each hook is built on top of **@tanstack/react-query**, which handles:

- **Caching** (persistent in production, disabled in development)
- **Automatic refetching** based on a configured `staleTime`
- **Request deduplication** to avoid duplicate API calls
- **Background updates** without blocking the UI

The hooks define:

- A **unique query key** for proper cache invalidation  
- The **API request function**  
- Optional settings like `staleTime`, `refetchInterval`, and retry behavior  

Examples of hooks include:

- `useChartData`
- `useAlerts`
- `useSchoolMetadata`

### Environment Behavior

React Query behaves differently depending on the environment, see [index.jsx](/src/index.jsx):

- **Development (`VITE_APP_ENV=development`)**  
  - Uses `QueryClientProvider`  
  - **No persistent caching** (always fetches fresh data)

- **Production (`VITE_APP_ENV=production`)**  
  - Uses `PersistQueryClientProvider`  
  - **Caching is persisted to localStorage** for faster loading and reduced server load