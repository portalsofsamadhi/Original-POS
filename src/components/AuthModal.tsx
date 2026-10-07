import { useState } from 'react';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useAuth } from '../contexts/useAuth';
import { AuthContextType } from '../contexts/AuthContextContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: { email: string }) => void;
}


const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const auth = useAuth() as AuthContextType;
  const setUser = auth?.setUser;

  // ...existing code...
  // Password strength function
  function getStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (mode === 'signup') {
      if (password !== verifyPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (passwordStrength < 3) {
        setError('Password is too weak. Please include uppercase, lowercase, numbers, and special characters.');
        setLoading(false);
        return;
      }
    }
    // Simulate auth
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email) {
        const profile = {
          email,
          joinDate: new Date().toISOString(),
        };
        localStorage.setItem('memberProfile', JSON.stringify(profile));
        setUser({ email });
        onAuthSuccess({ email });
        onOpenChange(false);
        // Clear form
        setEmail('');
        setPassword('');
        setVerifyPassword('');
        setError('');
      } else {
        setError('Please enter a valid email.');
      }
    } catch (_error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby="auth-modal-desc">
        <div id="auth-modal-desc" style={{ display: 'none' }}>Sign in or sign up to access your member profile and booking features.</div>
        <DialogHeader>
          <DialogTitle>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mbg-input"
          />
          <Input
            type="password"
            placeholder={mode === 'signup' ? 'Choose a password' : 'Password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setPasswordStrength(getStrength(e.target.value));
            }}
            onFocus={() => mode === 'signup' && setShowVerify(true)}
            required
            className="mbg-input"
          />
          {/* Password strength meter for signup */}
          {mode === 'signup' && password && (
            <div className="w-full h-2 rounded bg-gray-200 mb-1">
              <div
                className="h-2 rounded transition-all"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  background:
                    passwordStrength <= 2
                      ? '#f87171'
                      : passwordStrength === 3
                      ? '#facc15'
                      : passwordStrength === 4
                      ? '#34d399'
                      : '#16a34a',
                }}
              />
            </div>
          )}
          {/* Verify password field for signup */}
          {mode === 'signup' && showVerify && (
            <Input
              type="password"
              placeholder="Verify your password"
              value={verifyPassword}
              onChange={e => setVerifyPassword(e.target.value)}
              required
              className="mbg-input"
            />
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:from-green-700 hover:to-emerald-700" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
          <GoogleLoginButton
            onSuccess={(user: { email?: string }) => {
              if (user && user.email) {
                setUser({ email: user.email });
                onAuthSuccess({ email: user.email });
                onOpenChange(false);
              }
            }}
            onError={(_err) => {
              setError('Google sign in failed.');
            }}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="link"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full text-center"
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
