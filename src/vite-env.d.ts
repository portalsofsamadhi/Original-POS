/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL_USER: string
  readonly VITE_EMAIL_SERVICE: string
  readonly VITE_APP_URL: string
  readonly VITE_API_URL?: string
  readonly VITE_NEWSLETTER_API_URL?: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
