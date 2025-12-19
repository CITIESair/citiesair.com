/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: string // "development" | "production" for the frontend app
    readonly VITE_APP_BACKEND_URL: string // "http://localhost:3001" | "[SERVER DOMAIN]"
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
