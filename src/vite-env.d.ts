/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_FIREBASE_API_KEY: string
  readonly VITE_APP_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_APP_FIREBASE_PROJECT_ID: string
  readonly VITE_APP_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_APP_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_APP_FIREBASE_APP_ID: string
  readonly VITE_APP_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_APP_STRIPE_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}