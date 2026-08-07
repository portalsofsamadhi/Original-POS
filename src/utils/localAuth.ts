/**
 * Browser-local account store for profile sign-in / sign-up.
 * Passwords are hashed with Web Crypto (PBKDF2) — no bcrypt dependency.
 */

const ACCOUNTS_KEY = "pos_auth_accounts";
const SESSION_KEY = "memberProfile";

export type AuthAccount = {
  email: string;
  /** Format: pbkdf2$iterations$saltB64$hashB64  OR legacy bcrypt hash starting with $2 */
  passwordHash?: string;
  name?: string;
  phone?: string;
  picture?: string;
  provider: "password" | "google";
  createdAt: string;
};

export type SessionUser = {
  email: string;
  name?: string;
  phone?: string;
  picture?: string;
  provider?: "password" | "google";
};

function readAccounts(): AuthAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AuthAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    if (parsed?.email) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function writeSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function passwordScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function getPasswordStrength(password: string): number {
  return passwordScore(password);
}

function toB64(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += String.fromCharCode(bytes[i]);
  }
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}

async function hashPasswordPbkdf2(password: string, salt?: Uint8Array): Promise<string> {
  const saltBytes = salt ?? crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const iterations = 120000;
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  // Copy salt into a plain ArrayBuffer-backed Uint8Array for stable encoding
  const saltCopy = new Uint8Array(saltBytes);
  return `pbkdf2$${iterations}$${toB64(saltCopy)}$${toB64(bits)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith("pbkdf2$")) {
    const parts = stored.split("$");
    if (parts.length !== 4) return false;
    const iterations = Number(parts[1]);
    const salt = fromB64(parts[2]);
    const expected = parts[3];
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    return toB64(bits) === expected;
  }
  // Legacy bcrypt hashes (if any accounts were created with bcryptjs) — cannot verify without bcrypt; force reset
  if (stored.startsWith("$2")) {
    return false;
  }
  return false;
}

export async function signUpWithPassword(opts: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}): Promise<SessionUser> {
  const email = opts.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (opts.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (opts.password !== opts.confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  if (passwordScore(opts.password) < 3) {
    throw new Error(
      "Password is too weak. Use upper and lower case, a number, and preferably a symbol."
    );
  }

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === email)) {
    throw new Error("An account with this email already exists. Sign in instead.");
  }

  const passwordHash = await hashPasswordPbkdf2(opts.password);
  const account: AuthAccount = {
    email,
    passwordHash,
    name: opts.name?.trim() || undefined,
    provider: "password",
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  writeAccounts(accounts);

  const session: SessionUser = {
    email: account.email,
    name: account.name,
    provider: "password",
  };
  writeSession(session);
  return session;
}

export async function signInWithPassword(opts: {
  email: string;
  password: string;
}): Promise<SessionUser> {
  const email = opts.email.trim().toLowerCase();
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === email);

  if (!account) {
    throw new Error("No account found for this email. Create an account first.");
  }
  if (account.provider === "google" && !account.passwordHash) {
    throw new Error("This account uses Google sign-in. Continue with Google.");
  }
  if (!account.passwordHash) {
    throw new Error("This account has no password. Create a new account or use Google.");
  }

  if (account.passwordHash.startsWith("$2")) {
    throw new Error(
      "This account used an older password format. Please create a new account with the same email, or use Google sign-in."
    );
  }

  const ok = await verifyPassword(opts.password, account.passwordHash);
  if (!ok) {
    throw new Error("Incorrect email or password.");
  }

  const session: SessionUser = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    picture: account.picture,
    provider: account.provider,
  };
  writeSession(session);
  return session;
}

export function signInWithGoogle(opts: {
  email: string;
  name?: string;
  picture?: string;
}): SessionUser {
  const email = opts.email.trim().toLowerCase();
  if (!email) {
    throw new Error("Google did not return an email address.");
  }

  const accounts = readAccounts();
  let account = accounts.find((a) => a.email === email);
  if (!account) {
    account = {
      email,
      name: opts.name,
      picture: opts.picture,
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    accounts.push(account);
  } else {
    account.name = opts.name || account.name;
    account.picture = opts.picture || account.picture;
    if (account.provider !== "password") {
      account.provider = "google";
    }
  }
  writeAccounts(accounts);

  const session: SessionUser = {
    email: account.email,
    name: account.name,
    phone: account.phone,
    picture: account.picture,
    provider: "google",
  };
  writeSession(session);
  return session;
}

export function updateProfile(opts: {
  email: string;
  name?: string;
  phone?: string;
}): SessionUser {
  const email = opts.email.trim().toLowerCase();
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.email === email);
  if (idx >= 0) {
    accounts[idx] = {
      ...accounts[idx],
      name: opts.name?.trim() || accounts[idx].name,
      phone: opts.phone?.trim() || undefined,
    };
    writeAccounts(accounts);
  }

  const session: SessionUser = {
    email,
    name: opts.name?.trim() || undefined,
    phone: opts.phone?.trim() || undefined,
    picture: idx >= 0 ? accounts[idx].picture : undefined,
    provider: idx >= 0 ? accounts[idx].provider : undefined,
  };
  writeSession(session);
  return session;
}

export function signOutLocal() {
  clearSession();
}
