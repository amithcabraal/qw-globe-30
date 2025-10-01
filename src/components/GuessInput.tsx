import React, { useState, useEffect, useRef } from 'react';
import { Send, Flag } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface GuessInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (guessValue?: string) => void;
  gameStatus: 'playing' | 'won' | 'lost';
  disabled: boolean;
}

export function GuessInput({ value, onChange, onSubmit, gameStatus, disabled }: GuessInputProps) {
  const { allCountries, giveUp } = useGame();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.trim().length > 0 && gameStatus === 'playing') {
      const filtered = allCountries
        .filter(country =>
          country.name.toLowerCase().includes(value.toLowerCase())
        )
        .map(country => country.name)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [value, allCountries, gameStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowSuggestions(false);
    onSubmit(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? 'Game ended' : 'Enter your guess...'}
              disabled={disabled}
              className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bottom-full mb-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-6 py-3 text-left text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Guess</span>
          </button>

          <button
            type="button"
            onClick={giveUp}
            disabled={disabled}
            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Flag className="w-5 h-5" />
            <span className="hidden sm:inline">Give Up</span>
          </button>
        </div>
      </form>
    </div>
  );
}
