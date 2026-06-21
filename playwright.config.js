// playwright.config.mjs
// Playwright test configuration for POS Website (ESM)
// Docs: https://playwright.dev/docs/test-configuration

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173', // Change to your local dev server URL
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure',
  },
};

export default config;
