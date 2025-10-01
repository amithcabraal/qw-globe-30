import React from 'react';
import { X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === option.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={theme === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}>
                    {option.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    theme === option.value
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              More settings options coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
