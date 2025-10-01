import React, { useState } from 'react';
import { HelpCircle, Share2, Shield, Settings as SettingsIcon } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { HelpModal } from './HelpModal';
import { PrivacyModal } from './PrivacyModal';
import { ShareModal } from './ShareModal';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const [activeModal, setActiveModal] = useState<'settings' | 'help' | 'privacy' | 'share' | null>(null);

  const openModal = (modal: 'settings' | 'help' | 'privacy' | 'share') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleMenuItemClick = (modal: 'settings' | 'help' | 'privacy' | 'share') => {
    openModal(modal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed top-16 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 rounded-bl-lg overflow-hidden">
        <nav className="py-2">
          <button
            onClick={() => handleMenuItemClick('help')}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </button>

          <button
            onClick={() => handleMenuItemClick('share')}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => handleMenuItemClick('privacy')}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
          >
            <Shield className="w-5 h-5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => handleMenuItemClick('settings')}
            className="w-full px-6 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {activeModal === 'settings' && <SettingsPanel onClose={closeModal} />}
      {activeModal === 'help' && <HelpModal onClose={closeModal} />}
      {activeModal === 'privacy' && <PrivacyModal onClose={closeModal} />}
      {activeModal === 'share' && <ShareModal onClose={closeModal} />}
    </>
  );
}
