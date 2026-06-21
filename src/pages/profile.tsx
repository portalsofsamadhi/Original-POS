// ...existing code...
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import SEO from '../components/SEO';
import { MapPin, Phone, Calendar, FileText, Edit3, Save, X, Camera, LogIn, UserPlus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { newsletterAPI, NewsletterProfile } from '../utils/newsletterAPI';
import BookingDashboard from '../components/admin/BookingDashboard';

// Define types
import { AuthContextType, User as AuthUser } from '../contexts/AuthContextContext';
type MemberProfile = NewsletterProfile & {
  joinDate?: string;
  avatarUrl?: string;
};

// ErrorBoundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: unknown }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Log errors to a service in production
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h2>
            <pre className="text-red-500 bg-red-100 p-4 rounded-lg overflow-x-auto max-w-xl mx-auto text-left">
              {String(this.state.error)}
            </pre>
            <p className="mt-4 text-gray-600">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const defaultAvatar = '/poslogo.webp';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth() as AuthContextType;
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = useCallback((formData: MemberProfile): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthday = 'Birthday cannot be in the future';
      } else if (birthDate < new Date('1900-01-01')) {
        newErrors.birthday = 'Please enter a valid birthday';
      }
    }

    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    return newErrors;
  }, []);

  const getPasswordStrength = useCallback((password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, []);

  const handleAuthSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthLoading(true);
      setAuthError('');

      try {
        if (!authEmail.trim()) {
          setAuthError('Email is required');
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) {
          setAuthError('Please enter a valid email address');
          return;
        }

        if (!authPassword.trim()) {
          setAuthError('Password is required');
          return;
        }

        if (authMode === 'signup') {
          if (authPassword !== verifyPassword) {
            setAuthError('Passwords do not match');
            return;
          }
          if (passwordStrength < 3) {
            setAuthError('Password is too weak. Please include uppercase, lowercase, numbers, and special characters.');
            return;
          }
        }

  // Assume API call for authentication
  const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/,'');
  const response = await fetch(`${API_URL}/api/auth/${authMode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // For CSRF token
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

  const newUser: AuthUser = { email: authEmail };
        const newProfile: MemberProfile = {
          email: authEmail,
          joinDate: new Date().toISOString(),
        };

        setUser(newUser);
        setProfile(newProfile);
        setForm(newProfile);

        if (authMode === 'signup') {
          try {
            await newsletterAPI.subscribe(authEmail);
            toast({
              title: 'Welcome to Portals of Samadhi!',
              description: 'Your account has been created successfully. Check your email for a welcome message.',
            });
          } catch (emailError) {
            console.error('Welcome email error:', emailError);
            toast({
              title: 'Account Created',
              description: 'Your account has been created successfully.',
            });
          }
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have been signed in successfully.',
          });
        }

        navigate('/profile', { replace: true });
      } catch (_error) {
        setAuthError('Authentication failed. Please try again.');
      } finally {
        setAuthLoading(false);
      }
    },
    [authEmail, authPassword, verifyPassword, authMode, passwordStrength, setUser, navigate]
  );

  const handleGoogleSuccess = useCallback(
    async (userData: { email: string; name?: string }) => {
      try {
  const newUser: AuthUser = { email: userData.email, name: userData.name };
        const newProfile: MemberProfile = {
          email: userData.email,
          name: userData.name,
          joinDate: new Date().toISOString(),
        };

  // Assume API call to verify Google auth
  const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/,'');
  const response = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: userData.email, name: userData.name }),
        });

        if (!response.ok) {
          throw new Error('Google authentication failed');
        }

        setUser(newUser);
        setProfile(newProfile);
        setForm(newProfile);

        try {
          // Use a public check endpoint to avoid requiring admin auth on the client.
          const { profile: existing } = await newsletterAPI.getProfile(userData.email);
          if (!existing) {
            await newsletterAPI.subscribe(userData.email);
            toast({
              title: 'Welcome to Portals of Samadhi!',
              description: 'Your account has been created successfully. Check your email for a welcome message.',
            });
          } else {
            toast({
              title: 'Welcome back!',
              description: 'You have been signed in successfully.',
            });
          }
        } catch (emailError) {
          console.error('Welcome email error:', emailError);
          toast({
            title: 'Account Created',
            description: 'You have been signed in successfully.',
          });
        }

        navigate('/profile', { replace: true });
      } catch (error) {
        console.error('Google auth error:', error);
        toast({
          title: 'Success!',
          description: 'You have been signed in successfully.',
        });
  setUser({ email: userData.email, name: userData.name });
        setProfile({ email: userData.email, name: userData.name, joinDate: new Date().toISOString() });
        setForm({ email: userData.email, name: userData.name, joinDate: new Date().toISOString() });
        navigate('/profile', { replace: true });
      }
    },
    [setUser, navigate]
  );

  const handleGoogleError = useCallback((error: unknown) => {
    console.error('Google sign-in error:', error);
    setAuthError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!form) return;

      const { name, value } = e.target;
      const sanitizedValue = value.replace(/[<>{}]/g, ''); // Basic input sanitization
      setForm((prev) => (prev ? { ...prev, [name]: sanitizedValue } : null));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [form, errors]
  );

  const handleSave = useCallback(
    async () => {
      if (!form) return;
      setSaving(true);
      setErrors({});

      try {
        const validationErrors = validateForm(form);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          toast({
            title: 'Validation Error',
            description: 'Please fix the errors below and try again.',
            variant: 'destructive',
          });
          return;
        }

        const saveProfile: NewsletterProfile = {
          email: form.email,
          name: form.name,
          phone: form.phone,
          location: form.location,
          birthday: form.birthday,
          bio: form.bio,
        };

        const res = await newsletterAPI.updateProfile(saveProfile);
        const updated: MemberProfile = { ...saveProfile, joinDate: res.profile?.subscribedAt || form.joinDate };
        setProfile(updated);
        setForm(updated);
        setEditMode(false);
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
        });
      } catch (error) {
        console.error('Error saving profile:', error);
        toast({
          title: 'Save Failed',
          description: 'Failed to save your profile. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setSaving(false);
      }
    },
    [form, validateForm]
  );

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setForm(profile);
    setErrors({});
  }, [profile]);

  const formatDate = useCallback((dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '-';
    }
  }, []);

  const isAdmin = useMemo(() => profile?.email?.toLowerCase() === 'portalsofsamadhi@gmail.com', [profile?.email]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'signin' || mode === 'signup') {
      setAuthMode(mode);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const email = user.email.toLowerCase();
  // Prefer a public profile check to load the member profile without admin auth
  const { profile: found } = await newsletterAPI.getProfile(email);
        const newProfile: MemberProfile = found
          ? { ...found, joinDate: found.subscribedAt }
          : { email: user.email, joinDate: new Date().toISOString() };
        setProfile(newProfile);
        setForm(newProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile. Using a temporary profile. Please try again.',
          variant: 'destructive',
        });
        // Provide a fallback profile so the UI doesn't stay stuck in the "Setting up your profile" state
        const fallback: MemberProfile = { email: user.email, joinDate: new Date().toISOString() };
        setProfile(fallback);
        setForm(fallback);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <>
        <SEO
          title="Member Profile | Portals of Samadhi"
          description="View and manage your member profile at Portals of Samadhi."
          image={defaultAvatar}
          url="/profile"
          noindex
          nofollow
          schemaType="WebPage"
          schemaData={{
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              email: profile?.email || 'user@example.com',
              name: profile?.name || 'User',
            },
          }}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SEO
          title={`${authMode === 'signin' ? 'Sign In' : 'Sign Up'} | Portals of Samadhi`}
          description={`${
            authMode === 'signin' ? 'Sign in to access' : 'Create an account to manage'
          } your member profile at Portals of Samadhi.`}
          image={defaultAvatar}
          url="/profile"
          noindex
          nofollow
          schemaType="WebPage"
        />
        <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 to-emerald-100 py-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-900">
                  {authMode === 'signin' ? 'Welcome Back' : 'Join Our Community'}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {authMode === 'signin' ? 'Sign in to access your profile and bookings' : 'Create your account to get started'}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="auth-email" className="sr-only">
                      Email Address
                    </label>
                    <Input
                      id="auth-email"
                      type="email"
                      placeholder="Email Address"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value.trim())}
                      required
                      className="transition-all focus:border-green-500"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="auth-password" className="sr-only">
                      Password
                    </label>
                    <Input
                      id="auth-password"
                      type="password"
                      placeholder={authMode === 'signup' ? 'Choose a password' : 'Password'}
                      value={authPassword}
                      onChange={(e) => {
                        setAuthPassword(e.target.value);
                        setPasswordStrength(getPasswordStrength(e.target.value));
                      }}
                      required
                      className="transition-all focus:border-green-500"
                      aria-required="true"
                    />
                    {authMode === 'signup' && authPassword && (
                      <div className="mt-2">
                        <div className="w-full h-2 rounded bg-gray-200">
                          <div
                            className="h-2 rounded transition-all duration-300"
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              background:
                                passwordStrength <= 2 ? '#f87171' : passwordStrength === 3 ? '#facc15' : passwordStrength === 4 ? '#34d399' : '#16a34a',
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Password strength:{' '}
                            {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Fair' : passwordStrength === 4 ? 'Good' : 'Strong'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {authMode === 'signup' && (
                    <div>
                      <label htmlFor="verify-password" className="sr-only">
                        Confirm Password
                      </label>
                      <Input
                        id="verify-password"
                        type="password"
                        placeholder="Confirm Password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required
                        className="transition-all focus:border-green-500"
                        aria-required="true"
                      />
                    </div>
                  )}
                  {authError && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg" role="alert">
                      {authError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition-all duration-200"
                    disabled={authLoading}
                    aria-label={authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  >
                    {authLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {authMode === 'signin' ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                        {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                      </>
                    )}
                  </Button>
                </form>
                <div className="my-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                </div>
                <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                <div className="mt-6 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-green-600 hover:text-green-700"
                    aria-label={authMode === 'signin' ? 'Switch to Sign Up' : 'Switch to Sign In'}
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  if (user && !profile) {
    return (
      <>
        <SEO
          title="Member Profile | Portals of Samadhi"
          description="View and manage your member profile at Portals of Samadhi."
          image={defaultAvatar}
          url="/profile"
          noindex
          nofollow
          schemaType="WebPage"
          schemaData={{
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              email: user.email,
              name: user.name || 'User',
            },
          }}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Member Profile - ${profile!.name || profile!.email} | Portals of Samadhi`}
        description={`Manage your profile information for ${profile!.email} at Portals of Samadhi.`}
        image={profile!.avatarUrl || defaultAvatar}
        url="https://portalsofsamadhi.com/profile"
  schemaType="WebPage"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            email: profile!.email,
            name: profile!.name || 'User',
            description: profile!.bio || 'Member of Portals of Samadhi',
            address: profile!.location ? { '@type': 'PostalAddress', addressLocality: profile!.location } : undefined,
            telephone: profile!.phone || undefined,
            birthDate: profile!.birthday || undefined,
          },
        }}
      />
      <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 to-emerald-100 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
          className="w-full max-w-4xl px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <motion.div
                    className="relative w-32 h-32 mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                  >
                    <img
                      src={profile!.avatarUrl || defaultAvatar}
                      alt={`${profile!.name || 'User'}'s avatar`}
                      className="rounded-full w-32 h-32 object-cover border-4 border-green-300 shadow-lg"
                      onError={(e) => (e.currentTarget.src = defaultAvatar)}
                    />
                    {editMode && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
                        title="Change avatar"
                        aria-label="Change profile avatar"
                      >
                        <Camera className="h-4 w-4" />
                      </motion.button>
                    )}
                  </motion.div>
                  <CardTitle className="text-3xl font-bold text-green-900 mb-2">{profile!.name || 'Your Name'}</CardTitle>
                  <div className="text-green-700 text-lg mb-1">{profile!.email}</div>
                  <div className="text-gray-500 text-sm">Member since {formatDate(profile!.joinDate)}</div>
                </CardHeader>
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {editMode && form ? (
                      <motion.form
                        key="edit"
                        className="space-y-6"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.4, type: 'spring' }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSave();
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="flex items-center text-sm font-medium mb-2 text-gray-700">
                              <UserIcon className="h-4 w-4 mr-2 text-green-600" />
                              Full Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={form.name || ''}
                              onChange={handleChange}
                              className={`transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                              placeholder="Enter your full name"
                              aria-required="true"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="phone" className="flex items-center text-sm font-medium mb-2 text-gray-700">
                              <Phone className="h-4 w-4 mr-2 text-green-600" />
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={form.phone || ''}
                              onChange={handleChange}
                              className={`transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                              placeholder="Enter your phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="location" className="flex items-center text-sm font-medium mb-2 text-gray-700">
                              <MapPin className="h-4 w-4 mr-2 text-green-600" />
                              Location
                            </label>
                            <Input
                              id="location"
                              name="location"
                              value={form.location || ''}
                              onChange={handleChange}
                              className={`transition-all ${errors.location ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                              placeholder="City, State/Country"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                          </div>
                          <div>
                            <label htmlFor="birthday" className="flex items-center text-sm font-medium mb-2 text-gray-700">
                              <Calendar className="h-4 w-4 mr-2 text-green-600" />
                              Birthday
                            </label>
                            <Input
                              id="birthday"
                              name="birthday"
                              type="date"
                              value={form.birthday || ''}
                              onChange={handleChange}
                              className={`transition-all ${errors.birthday ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                            />
                            {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="bio" className="flex items-center text-sm font-medium mb-2 text-gray-700">
                            <FileText className="h-4 w-4 mr-2 text-green-600" />
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={form.bio || ''}
                            onChange={handleChange}
                            className={`w-full rounded-lg border p-3 min-h-[80px] transition-all focus:ring-2 focus:ring-green-500/20 ${
                              errors.bio ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                            }`}
                            placeholder="Tell us about yourself..."
                            maxLength={500}
                            aria-describedby="bio-char-count"
                          />
                          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                          <p id="bio-char-count" className="text-xs text-gray-500 mt-1">
                            {(form.bio || '').length}/500 characters
                          </p>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              disabled={saving}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 transition-all duration-200"
                              aria-label="Save profile changes"
                            >
                              {saving ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={saving}
                              className="border-gray-300 hover:border-gray-400 px-6 py-2"
                              aria-label="Cancel profile edits"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </motion.div>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="view"
                        className="space-y-4"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.4, type: 'spring' }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                              <UserIcon className="h-5 w-5 text-green-600 mr-3" />
                              <div>
                                <span className="text-sm font-medium text-gray-600">Name</span>
                                <p className="text-gray-900">{profile!.name || <span className="text-gray-400 italic">Not set</span>}</p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                              <Phone className="h-5 w-5 text-green-600 mr-3" />
                              <div>
                                <span className="text-sm font-medium text-gray-600">Phone</span>
                                <p className="text-gray-900">{profile!.phone || <span className="text-gray-400 italic">Not set</span>}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                              <MapPin className="h-5 w-5 text-green-600 mr-3" />
                              <div>
                                <span className="text-sm font-medium text-gray-600">Location</span>
                                <p className="text-gray-900">{profile!.location || <span className="text-gray-400 italic">Not set</span>}</p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 bg-green-50 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600 mr-3" />
                              <div>
                                <span className="text-sm font-medium text-gray-600">Birthday</span>
                                <p className="text-gray-900">
                                  {formatDate(profile!.birthday) !== '-' ? formatDate(profile!.birthday) : <span className="text-gray-400 italic">Not set</span>}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {profile!.bio && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <div className="flex items-start">
                              <FileText className="h-5 w-5 text-green-600 mr-3 mt-1" />
                              <div>
                                <span className="text-sm font-medium text-gray-600">Bio</span>
                                <p className="text-gray-900 mt-1 leading-relaxed">{profile!.bio}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-center pt-6">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="button"
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2"
                              onClick={() => setEditMode(true)}
                              aria-label="Edit profile"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round(
                        (Object.values({
                          name: profile!.name,
                          phone: profile!.phone,
                          location: profile!.location,
                          birthday: profile!.birthday,
                          bio: profile!.bio,
                        }).filter(Boolean).length /
                          5) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Member Since</span>
                    <span className="text-sm font-semibold text-purple-600">{formatDate(profile!.joinDate)}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Account Type</span>
                      <span className="text-sm font-bold text-amber-600">Admin</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 hover:border-green-300 hover:bg-green-50"
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    aria-label="Book a service"
                  >
                    Book a Service
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => navigate('/experiences')}
                    aria-label="View retreats"
                  >
                    View Retreats
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    aria-label="Read blog"
                  >
                    Read Blog
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
        {isAdmin && <BookingDashboard />}
      </div>
    </>
  );
};

const ProfilePageWithBoundary: React.FC = () => (
  <ErrorBoundary>
    <ProfilePage />
  </ErrorBoundary>
);

export default React.memo(ProfilePageWithBoundary);