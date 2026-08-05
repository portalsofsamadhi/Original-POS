import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LogOut, Mail, User, Phone } from "lucide-react";
import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";
import { useAuth } from "../contexts/useAuth";
import type { AuthContextType } from "../contexts/AuthContextContext";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import "../styles/luxury-theme.css";

const STORAGE_KEY = "memberProfile";
const googleEnabled = Boolean(
  import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    !String(import.meta.env.VITE_GOOGLE_CLIENT_ID).toLowerCase().includes("redacted")
);

type LocalProfile = {
  email: string;
  name?: string;
  phone?: string;
  picture?: string;
};

function loadLocalProfile(): LocalProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalProfile;
    if (parsed?.email) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function saveLocalProfile(profile: LocalProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

const ProfilePage: React.FC = () => {
  const { user, setUser, signOut } = useAuth() as AuthContextType;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const local = loadLocalProfile();
    if (user?.email) {
      setEmail(user.email);
      setName(user.name || local?.name || "");
      setPhone(local?.phone || "");
    } else if (local?.email) {
      setUser({ email: local.email, name: local.name });
      setEmail(local.email);
      setName(local.name || "");
      setPhone(local.phone || "");
    }
  }, [user?.email, user?.name, setUser]);

  const continueWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = guestEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    const profile: LocalProfile = {
      email: trimmed,
      name: guestName.trim() || undefined,
    };
    saveLocalProfile(profile);
    setUser({ email: profile.email, name: profile.name });
    setMessage("Welcome. Your profile is ready.");
  };

  const handleGoogleSuccess = (gUser: unknown) => {
    const u = gUser as { email?: string; name?: string; picture?: string };
    if (!u?.email) {
      setError("Google sign-in did not return an email.");
      return;
    }
    const profile: LocalProfile = {
      email: u.email,
      name: u.name,
      picture: u.picture,
      phone: loadLocalProfile()?.phone,
    };
    saveLocalProfile(profile);
    setUser({ email: profile.email, name: profile.name });
    setMessage("Signed in with Google.");
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const profile: LocalProfile = {
      email,
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      picture: loadLocalProfile()?.picture,
    };
    saveLocalProfile(profile);
    setUser({ email: profile.email, name: profile.name });
    setMessage("Profile saved.");
  };

  const handleSignOut = () => {
    signOut();
    setName("");
    setEmail("");
    setPhone("");
    setGuestEmail("");
    setGuestName("");
    setMessage("Signed out.");
  };

  const seo = PAGE_SEO["/profile"] || {
    title: "Profile | Portals of Samadhi",
    description: "Your Portals of Samadhi member space.",
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
          <div className="max-w-xl mx-auto px-4">
            <header className="text-center mb-8">
              <p className="luxury-hero__eyebrow" style={{ marginBottom: "0.75rem" }}>
                Portals of Samadhi
              </p>
              <h1 className="luxury-section__title" style={{ marginBottom: "0.5rem" }}>
                Your <em>Profile</em>
              </h1>
              <p className="luxury-section__lead" style={{ margin: "0 auto" }}>
                A quiet place for your details — so we can host you with care.
              </p>
            </header>

            {message ? (
              <p
                className="text-center text-sm mb-5"
                style={{ color: "var(--luxury-gold-light)" }}
                role="status"
              >
                {message}
              </p>
            ) : null}

            {!user ? (
              <div className="luxury-panel">
                <h2 className="luxury-panel__title">Continue as a guest</h2>
                <p className="luxury-panel__subtitle">
                  Leave your name and email. No password required for this basic setup.
                </p>

                <form onSubmit={continueWithEmail}>
                  <div className="luxury-field">
                    <label htmlFor="guest-name">Name</label>
                    <input
                      id="guest-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="How we should address you"
                      autoComplete="name"
                    />
                  </div>
                  <div className="luxury-field">
                    <label htmlFor="guest-email">Email *</label>
                    <input
                      id="guest-email"
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {error ? (
                    <p className="text-sm mb-3" style={{ color: "#e8a0a0" }}>
                      {error}
                    </p>
                  ) : null}
                  <button type="submit" className="luxury-btn luxury-btn--gold w-full justify-center">
                    Continue
                    <ArrowRight size={14} />
                  </button>
                </form>

                {googleEnabled ? (
                  <div className="mt-6 pt-5 border-t border-[var(--luxury-gold-muted)]">
                    <p className="text-center text-xs uppercase tracking-widest mb-3" style={{ color: "var(--luxury-cream-muted)" }}>
                      Or continue with Google
                    </p>
                    <GoogleLoginButton
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError("Google sign-in failed. Try email instead.")}
                    />
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <Link to="/experiences" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                    Tours
                  </Link>
                  <Link to="/airport-runs" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                    Airport Runs
                  </Link>
                  <Link to="/book-now" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                    Book a session
                  </Link>
                </div>
              </div>
            ) : (
              <div className="luxury-panel">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--luxury-gold-muted)]"
                    style={{ background: "var(--luxury-charcoal)" }}
                    aria-hidden
                  >
                    <User className="h-6 w-6 text-[var(--luxury-gold-light)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-[var(--luxury-cream)] truncate">
                      {name || "Guest"}
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
                      placeholder="Your name"
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
                    <Link to="/plan-retreat" className="luxury-btn luxury-btn--outline luxury-btn--sm">
                      Sacred gatherings
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
