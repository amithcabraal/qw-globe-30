import React, { useEffect, useState } from 'react';
import { Globe, X } from 'lucide-react';
import { getOrCreateUserSettings, dismissWelcomeModal } from '../services/userService';

export function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    const settings = await getOrCreateUserSettings();
    setIsVisible(!settings.welcome_modal_dismissed);
    setIsLoading(false);
  };

  const handleDismiss = async () => {
    setIsVisible(false);
    await dismissWelcomeModal();
  };

  if (isLoading || !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-10 h-10" />
              <h2 className="text-2xl font-bold">Welcome to Country Quiz!</h2>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close welcome modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to Play
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Test your geography knowledge by guessing countries using various clues!
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Choose from <strong>6 different clues</strong>: Flag, Map, Capital, Export, Fun Fact, and Region
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                You have <strong>3 guesses</strong> to find the correct country
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Use <strong>fewer clues</strong> and guess correctly on the first try for maximum points!
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Choose Your Difficulty
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong className="text-green-600 dark:text-green-400">Easy:</strong> 30 most populous countries</p>
              <p><strong className="text-yellow-600 dark:text-yellow-400">Medium:</strong> Next 50 largest countries</p>
              <p><strong className="text-red-600 dark:text-red-400">Hard:</strong> 120 countries from around the world</p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
