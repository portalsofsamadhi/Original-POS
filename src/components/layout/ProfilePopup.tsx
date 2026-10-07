import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { Button } from '../ui/button';
import AuthModal from '../AuthModal';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}


const ProfilePopup = ({ isOpen, onClose }: ProfilePopupProps) => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-72 max-w-sm">
        <div className="p-6">
          {user ? (
            // Authenticated user view
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                  <p className="text-xs text-gray-500 truncate max-w-40">{user.email}</p>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start space-x-3 h-auto py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            // Guest user view
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Welcome</h3>
                <p className="text-sm text-gray-500">Sign in to access your profile and bookings</p>
              </div>

              {/* Auth Modal Trigger Button */}
              <div className="space-y-3">
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  variant="outline"
                  className="w-full justify-start space-x-3 h-11"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in / Sign up</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal (handles both sign in and sign up, including Google) */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={() => {
          setAuthModalOpen(false);
          onClose();
          navigate('/profile');
        }}
      />
    </>
  );
};

export default ProfilePopup;
