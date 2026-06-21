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

/** Gmail/Zoho app passwords are often pasted with spaces — strip them. */
function getSmtpPass() {
  const pass =
    sanitizeEnvString(process.env.SMTP_PASS) ||
    sanitizeEnvString(process.env.EMAIL_PASSWORD);
  return pass ? pass.replace(/\s+/g, '') : undefined;
}

function getSmtpHost() {
  const configured = sanitizeEnvString(process.env.SMTP_HOST);
  if (configured) return configured;

  const user = getSmtpUser().toLowerCase();
  if (user.includes('zoho')) return 'smtp.zoho.com';
  if (user.includes('gmail') || user.includes('googlemail')) return 'smtp.gmail.com';
  return 'smtp.gmail.com';
}

function getSmtpPort() {
  const configured = sanitizeEnvString(process.env.SMTP_PORT);
  return configured ? Number(configured) : 587;
}

let mailTransporter = null;

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
  });

  return mailTransporter;
}

function isSmtpConfigured() {
  return !!getSmtpPass();
}

module.exports = {
  sanitizeEnvString,
  getTeamEmail,
  getFromAddress,
  getSmtpUser,
  getSmtpPass,
  getSmtpHost,
  getSmtpPort,
  getMailTransporter,
  isSmtpConfigured,
};