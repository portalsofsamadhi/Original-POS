const nodemailer = require('nodemailer');

/** Strip surrounding quotes and whitespace from env values. */
function sanitizeEnvString(value) {
  if (value == null || value === '') return undefined;
  let v = String(value).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

function getTeamEmail() {
  return sanitizeEnvString(process.env.TEAM_EMAIL) || 'info@portalsofsamadhi.com';
}

/**
 * Where form notifications should be delivered.
 * Prefer NOTIFY_EMAIL if set (can differ from SMTP_USER so mail lands in Inbox).
 */
function getNotifyEmail() {
  return (
    sanitizeEnvString(process.env.NOTIFY_EMAIL) ||
    getTeamEmail()
  );
}

/**
 * Zoho/Gmail put same-mailbox SMTP sends in Sent, not Inbox.
 * If TO equals the SMTP login, use plus-addressing (info+forms@…) so delivery
 * is treated as inbound to the same mailbox Inbox when the host supports it.
 * Override with NOTIFY_EMAIL to a different address for the cleanest fix.
 */
function resolveInboundTo(requestedTo) {
  const explicitNotify = sanitizeEnvString(process.env.NOTIFY_EMAIL);
  if (explicitNotify) return explicitNotify;

  const dest = (sanitizeEnvString(requestedTo) || getTeamEmail()).trim();
  const smtpUser = getSmtpUser().toLowerCase();
  if (dest.toLowerCase() !== smtpUser) return dest;

  const at = dest.indexOf('@');
  if (at <= 0) return dest;
  const local = dest.slice(0, at);
  const domain = dest.slice(at + 1);
  if (!local || !domain || local.includes('+')) return dest;
  return `${local}+forms@${domain}`;
}

function getFromAddress() {
  return sanitizeEnvString(process.env.SMTP_FROM) || `Portals of Samadhi <${getTeamEmail()}>`;
}

function getSmtpUser() {
  let user =
    sanitizeEnvString(process.env.SMTP_USER) ||
    sanitizeEnvString(process.env.EMAIL_USER) ||
    'portalsofsamadhi@gmail.com';
  if (!user.includes('@')) {
    user = 'portalsofsamadhi@gmail.com';
  }
  return user;
}

/** App passwords are often pasted with spaces — strip them. */
function getSmtpPass() {
  const pass =
    sanitizeEnvString(process.env.SMTP_PASS) ||
    sanitizeEnvString(process.env.EMAIL_APP_PASSWORD) ||
    sanitizeEnvString(process.env.EMAIL_PASSWORD);
  return pass ? pass.replace(/\s+/g, '') : undefined;
}

function getSmtpHost() {
  const configured = sanitizeEnvString(process.env.SMTP_HOST);
  if (configured) return configured;

  const user = getSmtpUser().toLowerCase();
  if (user.endsWith('@zohomail.com') || user.endsWith('@zoho.com')) {
    return 'smtp.zoho.com';
  }
  if (user.includes('gmail') || user.includes('googlemail')) {
    return 'smtp.gmail.com';
  }
  if (user.includes('@')) {
    // Custom-domain mailboxes on Zoho (e.g. info@portalsofsamadhi.com)
    return 'smtppro.zoho.com';
  }
  return 'smtp.gmail.com';
}

function getSmtpPort() {
  const configured = sanitizeEnvString(process.env.SMTP_PORT);
  return configured ? Number(configured) : 587;
}

let mailTransporter = null;
let lastAuthCheck = { at: 0, ok: false, error: null };
const AUTH_CACHE_MS = 5 * 60 * 1000;

function getMailTransporter(forceNew = false) {
  if (forceNew) mailTransporter = null;
  if (mailTransporter) return mailTransporter;

  const user = getSmtpUser();
  const pass = getSmtpPass();
  if (!pass) return null;

  const host = getSmtpHost();
  const port = getSmtpPort();
  const secure = port === 465;

  mailTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure,
    tls: { minVersion: 'TLSv1.2' },
  });

  return mailTransporter;
}

function isSmtpConfigured() {
  return !!getSmtpPass();
}

async function verifySmtpAuth(force = false) {
  const now = Date.now();
  if (!force && now - lastAuthCheck.at < AUTH_CACHE_MS) {
    return lastAuthCheck;
  }

  const transporter = getMailTransporter(force);
  if (!transporter) {
    lastAuthCheck = { at: now, ok: false, error: 'SMTP_PASS not set' };
    return lastAuthCheck;
  }

  try {
    await transporter.verify();
    lastAuthCheck = { at: now, ok: true, error: null };
  } catch (err) {
    lastAuthCheck = { at: now, ok: false, error: err.message };
    getMailTransporter(true);
  }

  return lastAuthCheck;
}

module.exports = {
  sanitizeEnvString,
  getTeamEmail,
  getNotifyEmail,
  resolveInboundTo,
  getFromAddress,
  getSmtpUser,
  getSmtpPass,
  getSmtpHost,
  getSmtpPort,
  getMailTransporter,
  isSmtpConfigured,
  verifySmtpAuth,
};