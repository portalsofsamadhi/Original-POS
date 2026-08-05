import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Mail, User, Phone } from "lucide-react";
import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";
import { useAuth } from "../contexts/useAuth";
import type { AuthContextType } from "../contexts/AuthContextContext";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import {
  getPasswordStrength,
  getSession,
  signInWithGoogle,
  signInWithPassword,
  signOutLocal,
  signUpWithPassword,
  updateProfile,
} from "../utils/localAuth";
import "../styles/luxury-theme.css";

const googleEnabled = Boolean(
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    !String(import.meta.env.VITE_GOOGLE_CLIENT_ID).toLowerCase().includes("redacted")
);

type AuthMode = "signin" | "signup";

const ProfilePage: React.FC = () => {
  const { user, setUser, signOut } = useAuth() as AuthContextType;
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirm, setAuthConfirm] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (session?.email) {
      setUser({ email: session.email, name: session.name });
      setEmail(session.email);
      setName(session.name || "");
      setPhone(session.phone || "");
    }
  }, [setUser]);

  useEffect(() => {
    if (user?.email) {
      const session = getSession();
      setEmail(user.email);
      setName(user.name || session?.name || "");
      setPhone(session?.phone || "");
    }
  }, [user?.email, user?.name]);

  const strength = getPasswordStrength(authPassword);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setAuthLoading(true);
    try {
      const session =
        authMode === "signup"
          ? await signUpWithPassword({
              email: authEmail,
              password: authPassword,
              confirmPassword: authConfirm,
              name: authName,
            })
          : await signInWithPassword({
              email: authEmail,
              password: authPassword,
            });
      setUser({ email: session.email, name: session.name });
      setEmail(session.email);
      setName(session.name || "");
      setPhone(session.phone || "");
      setAuthPassword("");
      setAuthConfirm("");
      setMessage(authMode === "signup" ? "Account created. You are signed in." : "Signed in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSuccess = (gUser: unknown) => {
    setError("");
    try {
      const u = gUser as { email?: string; name?: string; picture?: string };
      const session = signInWithGoogle({
        email: u.email || "",
        name: u.name,
        picture: u.picture,
      });
      setUser({ email: session.email, name: session.name });
      setEmail(session.email);
      setName(session.name || "");
      setPhone(session.phone || "");
      setMessage("Signed in with Google.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const session = updateProfile({ email, name, phone });
      setUser({ email: session.email, name: session.name });
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    }
  };

  const handleSignOut = () => {
    signOutLocal();
    signOut();
    setName("");
    setEmail("");
    setPhone("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthConfirm("");
    setAuthName("");
    setMessage("Signed out.");
  };

  const seo = PAGE_SEO["/profile"] || {
    title: "Profile | Portals of Samadhi",
    description: "Sign in to your Portals of Samadhi profile.",
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        image={seo.image || "/poslogo.webp"}
        imageAlt={seo.imageAlt || "Profile"}
        url="/profile"
        noindex
      />

      <div className="luxury-page min-h-[calc(100vh-4rem)]">
        <div className="luxury-page-body" style={{ paddingTop: "2.5rem", paddingBottom: "3.5rem" }}>
          <div className="max-w-md mx-auto px-4">
            <header className="text-center mb-8">
              <p className="luxury-hero__eyebrow" style={{ marginBottom: "0.75rem" }}>
                Portals of Samadhi
              </p>
              <h1 className="luxury-section__title" style={{ marginBottom: "0.5rem" }}>
                Your <em>Profile</em>
              </h1>
              <p className="luxury-section__lead" style={{ margin: "0 auto" }}>
                Sign in with Google or email and password.
              </p>
            </header>

            {message ? (
              <p className="text-center text-sm mb-4" style={{ color: "var(--luxury-gold-light)" }} role="status">
                {message}
              </p>
            ) : null}

            {!user ? (
              <div className="luxury-panel">
                {/* Mode tabs */}
                <div className="flex gap-2 mb-5 p-1 rounded" style={{ background: "var(--luxury-charcoal)" }}>
                  <button
                    type="button"
                    className="flex-1 py-2 text-sm rounded transition-colors"
                    style={{
                      background: authMode === "signin" ? "rgba(201,169,98,0.2)" : "transparent",
                      color: authMode === "signin" ? "var(--luxury-cream)" : "var(--luxury-cream-muted)",
                      border: authMode === "signin" ? "1px solid var(--luxury-gold-muted)" : "1px solid transparent",
                    }}
                    onClick={() => {
                      setAuthMode("signin");
                      setError("");
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 text-sm rounded transition-colors"
                    style={{
                      background: authMode === "signup" ? "rgba(201,169,98,0.2)" : "transparent",
                      color: authMode === "signup" ? "var(--luxury-cream)" : "var(--luxury-cream-muted)",
                      border: authMode === "signup" ? "1px solid var(--luxury-gold-muted)" : "1px solid transparent",
                    }}
                    onClick={() => {
                      setAuthMode("signup");
                      setError("");
                    }}
                  >
                    Create account
                  </button>
                </div>

                {/* Google — standard option */}
                <div className="mb-5">
                  <p className="text-center text-xs uppercase tracking-widest mb-3" style={{ color: "var(--luxury-gold)" }}>
                    Continue with Google
                  </p>
                  {googleEnabled ? (
                    <GoogleLoginButton
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError("Google sign-in failed. Use email and password instead.")}
                    />
                  ) : (
                    <p className="text-center text-xs" style={{ color: "var(--luxury-cream-muted)" }}>
                      Google sign-in appears when <code className="text-[var(--luxury-gold-light)]">VITE_GOOGLE_CLIENT_ID</code> is set on the server.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ background: "var(--luxury-gold-muted)" }} />
                  <span className="text-xs uppercase tracking-widest" style={{ color: "var(--luxury-cream-muted)" }}>
                    or email
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--luxury-gold-muted)" }} />
                </div>

                <form onSubmit={handleAuthSubmit}>
                  {authMode === "signup" ? (
                    <div className="luxury-field">
                      <label htmlFor="auth-name">Name</label>
                      <input
                        id="auth-name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>
                  ) : null}

                  <div className="luxury-field">
                    <label htmlFor="auth-email">Email</label>
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="luxury-field">
                    <label htmlFor="auth-password">Password</label>
                    <input
                      id="auth-password"
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder={authMode === "signup" ? "At least 8 characters" : "Your password"}
                      autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                    />
                    {authMode === "signup" && authPassword ? (
                      <div className="mt-1.5 h-1 rounded overflow-hidden" style={{ background: "var(--luxury-charcoal)" }}>
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${(strength / 5) * 100}%`,
                            background:
                              strength <= 2 ? "#c07070" : strength === 3 ? "#c9a962" : "#8fbf8f",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  {authMode === "signup" ? (
                    <div className="luxury-field">
                      <label htmlFor="auth-confirm">Confirm password</label>
                      <input
                        id="auth-confirm"
                        type="password"
                        required
                        value={authConfirm}
                        onChange={(e) => setAuthConfirm(e.target.value)}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                      />
                    </div>
                  ) : null}

                  {error ? (
                    <p className="text-sm mb-3" style={{ color: "#e8a0a0" }} role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="luxury-btn luxury-btn--gold w-full justify-center"
                  >
                    {authLoading
                      ? "Please wait…"
                      : authMode === "signin"
                        ? "Sign in"
                        : "Create account"}
                  </button>
                </form>

                <p className="text-center text-xs mt-4" style={{ color: "var(--luxury-cream-muted)" }}>
                  {authMode === "signin" ? (
                    <>
                      No account?{" "}
                      <button
                        type="button"
                        className="underline"
                        style={{ color: "var(--luxury-gold-light)" }}
                        onClick={() => setAuthMode("signup")}
                      >
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="underline"
                        style={{ color: "var(--luxury-gold-light)" }}
                        onClick={() => setAuthMode("signin")}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="luxury-panel">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--luxury-gold-muted)]"
                    style={{ background: "var(--luxury-charcoal)" }}
                  >
                    <User className="h-6 w-6 text-[var(--luxury-gold-light)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-[var(--luxury-cream)] truncate">
                      {name || "Member"}
                    </p>
                    <p className="text-sm text-[var(--luxury-cream-muted)] truncate flex items-center gap-1.5">
                      <Mail size={12} /> {email}
                    </p>
                  </div>
                </div>

                <form onSubmit={saveProfile}>
                  <div className="luxury-field">
                    <label htmlFor="profile-name">Name</label>
                    <input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="profile-email">Email</label>
                    <input id="profile-email" type="email" value={email} readOnly disabled />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="profile-phone">Phone</label>
                    <div className="relative">
                      <Phone
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--luxury-gold-muted)] pointer-events-none"
                      />
                      <input
                        id="profile-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Optional"
                        autoComplete="tel"
                        className="!pl-9"
                      />
                    </div>
                  </div>
                  {error ? (
                    <p className="text-sm mb-3" style={{ color: "#e8a0a0" }}>
                      {error}
                    </p>
                  ) : null}
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <button type="submit" className="luxury-btn luxury-btn--gold flex-1 justify-center">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="luxury-btn luxury-btn--outline flex-1 justify-center"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-5 border-t border-[var(--luxury-gold-muted)]">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--luxury-gold)" }}>
                    Explore
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/experiences" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                      Tours
                    </Link>
                    <Link to="/airport-runs" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                      Airport Runs
                    </Link>
                    <Link to="/book-now" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                      Healing
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
