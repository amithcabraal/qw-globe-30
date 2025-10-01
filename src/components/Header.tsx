import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { BurgerMenu } from './BurgerMenu';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8" />
              <h1 className="text-xl sm:text-2xl font-bold">Country Quiz</h1>
            </div>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
