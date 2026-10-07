const { extractEmail, getTeamEmail } = require("./smtpConfig.cjs");

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map();

const TEAM_SUBJECTS = [
  /^Website Contact:/i,
  /^Info Session Request/i,
  /^New Booking/i,
];

const VISITOR_SUBJECTS = [
  /^✅ Booking Confirmed/i,
  /^🧾 Payment Receipt/i,
  /^⏰ Reminder:/i,
];

const SPAM_TEXT =
  /\b(viagra|cialis|crypto\s*airdrop|bitcoin\s*invest|seo\s*backlink|casino\s*bonus|loan\s*approval|whatsapp\s*\+\d{8})\b/i;

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  row.count += 1;
  return row.count > MAX_PER_WINDOW;
}

function looksLikeEmail(value) {
  const addr = extractEmail(value);
  return Boolean(addr && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr));
}

function countLinks(html) {
  const matches = String(html || "").match(/https?:\/\//gi);
  return matches ? matches.length : 0;
}

function originAllowed(req, allowedOrigins) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (origin && allowedOrigins.includes(origin)) return true;
  if (typeof referer === "string") {
    return allowedOrigins.some((allowed) => referer.startsWith(`${allowed}/`) || referer === allowed);
  }
  return false;
}

function inspectMailRequest(req, allowedOrigins) {
  if (!originAllowed(req, allowedOrigins)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return { ok: false, status: 429, error: "Too many requests" };
  }

  const body = req.body || {};
  const honeypot = String(body.website || body.company || body.fax || "").trim();
  if (honeypot) {
    return { ok: false, status: 204, silent: true };
  }

  const subject = String(body.subject || "").trim();
  const html = String(body.html || "");
  const replyTo = extractEmail(body.replyTo);
  const requestedTo = extractEmail(body.to);
  const team = getTeamEmail();

  if (!subject || !html) {
    return { ok: false, status: 400, error: "Missing required fields" };
  }
  if (subject.length > 180 || html.length > 40000) {
    return { ok: false, status: 400, error: "Message too large" };
  }
  if (SPAM_TEXT.test(subject) || SPAM_TEXT.test(html)) {
    return { ok: false, status: 204, silent: true };
  }
  if (countLinks(html) > 6) {
    return { ok: false, status: 204, silent: true };
  }

  const teamSubject = TEAM_SUBJECTS.some((re) => re.test(subject));
  const visitorSubject = VISITOR_SUBJECTS.some((re) => re.test(subject));
  if (!teamSubject && !visitorSubject) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  if (teamSubject) {
    const started = Number(body.formStarted);
    if (!Number.isFinite(started) || Date.now() - started < 2500) {
      return { ok: false, status: 400, error: "Please try again" };
    }
    if (replyTo && !looksLikeEmail(replyTo)) {
      return { ok: false, status: 400, error: "Invalid reply address" };
    }
    return {
      ok: true,
      deliverTo: team,
      replyTo: looksLikeEmail(replyTo) ? replyTo : team,
    };
  }

  if (!looksLikeEmail(requestedTo) || !visitorSubject) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return {
    ok: true,
    deliverTo: requestedTo,
    replyTo: looksLikeEmail(replyTo) ? replyTo : team,
  };
}

module.exports = {
  inspectMailRequest,
  clientIp,
};
