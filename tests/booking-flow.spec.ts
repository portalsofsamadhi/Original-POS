// tests/booking-flow.spec.ts
// Automated end-to-end test for booking flow (PayPal/Stripe) and admin dashboard
import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = `testuser+${Date.now()}@example.com`;
const TEST_NAME = 'Test User';
const TEST_PHONE = '555-123-4567';
const _TEST_SERVICE = 'Healing Session';

// Helper: Go to booking page and fill out form

async function fillBookingForm(page: Page) {
  await page.goto('/');
  // Wait for the Book Now button to be visible and click it
  const bookNowButton = page.getByRole('button', { name: /book now/i }).first();
  await bookNowButton.waitFor({ state: 'visible', timeout: 15000 });
  await bookNowButton.click();
  // Select date and time
  await page.locator('button', { hasText: /continue/i }).click();
  // Fill details
  await page.fill('input[name="name"]', TEST_NAME);
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="phone"]', TEST_PHONE);
  await page.locator('button', { hasText: /proceed to payment/i }).click();
}

test.describe('Booking Flow', () => {
  test('PayPal booking and admin dashboard', async ({ page }) => {
    await fillBookingForm(page);
    // Wait for PayPal button
    await page.waitForSelector('#paypal-button-container iframe', { timeout: 15000 });
    // Simulate PayPal payment (sandbox: manual interaction required)
    // Optionally, automate sandbox login if credentials are available
    // For now, just check that the button appears
    expect(await page.isVisible('#paypal-button-container')).toBeTruthy();
    // (Manual step: complete PayPal payment in sandbox)
  });

  test('Stripe booking and admin dashboard', async ({ page }) => {
    await fillBookingForm(page);
    // Click Stripe button
    await page.locator('button', { hasText: /pay with card/i }).click();
    // Should redirect to Stripe Checkout
    await expect(page).toHaveURL(/stripe.com/);
    // (Manual step: complete Stripe test payment)
  });

  test('Admin dashboard shows new booking', async ({ page }) => {
    // Open admin dashboard
    await page.goto('/');
    await page.locator('button', { hasText: /admin dashboard/i }).click();
    await expect(page.locator('h2')).toHaveText(/admin dashboard/i);
    // Check for test booking
    const found = await page.locator('td', { hasText: TEST_EMAIL }).count();
    expect(found).toBeGreaterThan(0);
  });
});
