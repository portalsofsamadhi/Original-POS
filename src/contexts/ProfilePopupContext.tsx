import React, { createContext, useContext, useState } from 'react';

interface ProfilePopupContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ProfilePopupContext = createContext<ProfilePopupContextType | undefined>(undefined);

export const ProfilePopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <ProfilePopupContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ProfilePopupContext.Provider>
  );
};

export const useProfilePopup = () => {
  const ctx = useContext(ProfilePopupContext);
  if (!ctx) throw new Error('useProfilePopup must be used within a ProfilePopupProvider');
  return ctx;
};
