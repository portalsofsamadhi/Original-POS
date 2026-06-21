/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL_USER: string
  readonly VITE_EMAIL_SERVICE: string
  readonly VITE_APP_URL: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
