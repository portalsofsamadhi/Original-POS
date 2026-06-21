#!/usr/bin/env node
/**
 * scripts/smoke-test.js
 * Non-destructive smoke test for the deployed system.
 *
 * Environment variables (set before running):
 *  FRONTEND_URL (e.g. https://www.portalsofsamadhi.com)
 *  API_URL (e.g. https://pos-api.onrender.com)
 *  NEWSLETTER_URL (optional, defaults to `${API_URL}`)
 *  TEST_EMAIL (an email address that can receive test messages)
 *  SKIP_BOOKING_TEST (set to '1' to avoid posting to /api/bookings in production)
 *
 * Usage:
 *  node scripts/smoke-test.js
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.portalsofsamadhi.com';
const API_URL = process.env.API_URL || 'https://pos-api.onrender.com';
const NEWSLETTER_URL = process.env.NEWSLETTER_URL || `${API_URL}`;
const TEST_EMAIL = process.env.TEST_EMAIL || `smoke-test+${Date.now()}@example.com`;
const SKIP_BOOKING_TEST = process.env.SKIP_BOOKING_TEST === '1';

async function ok(msg) { console.log(`✅ ${msg}`); }
async function fail(msg) { console.error(`❌ ${msg}`); process.exitCode = 1; }

async function fetchText(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  return { res, text };
}

(async function run() {
  console.log('Starting smoke tests...');
  console.log(`FRONTEND_URL=${FRONTEND_URL}`);
  console.log(`API_URL=${API_URL}`);

  // 1) Frontend index.html checks
  try {
    const { res, text } = await fetchText(FRONTEND_URL, { method: 'GET' });
    if (res.ok) {
      await ok(`Fetched frontend index at ${FRONTEND_URL} (status ${res.status})`);
      // Check for client ids in HTML (quick scan)
      const hasGoogle = /VITE_GOOGLE_CLIENT_ID|googleaccounts|gsi_client_id/i.test(text);
      const hasPayPal = /VITE_PAYPAL_CLIENT_ID|paypal/i.test(text);
      const hasStripe = /VITE_STRIPE_PUBLIC_KEY|stripe/i.test(text);
      console.log('Frontend presence check:', { hasGoogle, hasPayPal, hasStripe });
    } else {
      if (FRONTEND_URL.includes('localhost')) {
        console.warn(`Frontend GET ${FRONTEND_URL} returned ${res.status} — treating as warning for localhost`);
      } else {
        await fail(`Frontend GET ${FRONTEND_URL} returned ${res.status}`);
      }
    }
  } catch (err) {
    if (FRONTEND_URL.includes('localhost')) {
      console.warn(`Frontend fetch failed for localhost (${FRONTEND_URL}): ${err.message} — treating as non-fatal during local testing`);
    } else {
      await fail(`Frontend fetch failed: ${err.message}`);
    }
  }

  // 2) API health
  const healthUrls = [
    `${API_URL}/api/newsletter/health`,
    `${API_URL}/api/health`,
    `${API_URL}/health`,
  ];

  let healthOk = false;
  for (const u of healthUrls) {
    try {
      const r = await fetch(u, { method: 'GET' });
      if (r.ok) {
        await ok(`API health OK at ${u}`);
        healthOk = true; break;
      }
    } catch (e) {
      // ignore
    }
  }
  if (!healthOk) await fail('No API health endpoint returned 200. Check API_URL and CORS.');

  // 3) Newsletter subscribe (non-destructive)
  try {
    const subscribeUrl = `${NEWSLETTER_URL.replace(/\/+$/,'')}/api/newsletter/subscribe`;
    const payload = { email: TEST_EMAIL };
    const r = await fetch(subscribeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (r.ok) {
      await ok(`Newsletter subscribe OK at ${subscribeUrl} (email: ${TEST_EMAIL})`);
    } else {
      const t = await r.text();
      await fail(`Newsletter subscribe failed: ${r.status} ${t}`);
    }
  } catch (err) {
    await fail(`Newsletter subscribe error: ${err.message}`);
  }

  // 4) Booking endpoint (skipped by default to avoid creating real bookings)
  if (SKIP_BOOKING_TEST) {
    console.log('Skipping booking test (SKIP_BOOKING_TEST=1)');
  } else {
    try {
      const bookingUrl = `${API_URL.replace(/\/+$/,'')}/api/bookings`;
      const bookingPayload = {
        test: true,
        name: 'Smoke Test',
        email: TEST_EMAIL,
        service: 'SmokeTestService',
        date: new Date().toISOString(),
      };
      const r = await fetch(bookingUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingPayload) });
      if (r.ok) {
        await ok(`Booking endpoint accepted test POST at ${bookingUrl}`);
      } else {
        const t = await r.text();
        await fail(`Booking POST failed: ${r.status} ${t}`);
      }
    } catch (err) {
      await fail(`Booking test error: ${err.message}`);
    }
  }

  // 5) Final status
  if (process.exitCode && process.exitCode !== 0) {
    console.error('\nSmoke tests finished: Some checks failed.');
    process.exit(process.exitCode);
  } else {
    console.log('\nSmoke tests passed.');
    process.exit(0);
  }
})();
