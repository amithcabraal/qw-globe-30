import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { getOrCreateUserAchievements } from '../services/userService';
import { UserAchievements } from '../types';

interface ShareModalProps {
  onClose: () => void;
}

export function ShareModal({ onClose }: ShareModalProps) {
  const { gameState } = useGame();
  const [activeTab, setActiveTab] = useState<'game' | 'stats'>('game');
  const [copied, setCopied] = useState(false);
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const data = await getOrCreateUserAchievements();
    setAchievements(data);
  };

  const getClueEmoji = (clue: string): string => {
    const emojiMap: Record<string, string> = {
      flag: '🏴',
      map: '🗺️',
      capital: '🏛️',
      export: '📦',
      fact: '💡',
      region: '🌍',
    };
    return emojiMap[clue] || '❓';
  };

  const generateGameShareText = (): string => {
    if (gameState.gameStatus === 'playing' || !gameState.currentCountry) {
      return 'Play Country Quiz and share your results!';
    }

    const difficultyEmoji = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    }[gameState.difficulty];

    const statusEmoji = gameState.gameStatus === 'won' ? '✅' : '❌';
    const cluesUsed = gameState.revealedClues.map(getClueEmoji).join('');
    const guesses = 3 - gameState.guessesRemaining;

    return `Country Quiz ${difficultyEmoji} ${statusEmoji}

Country: ${gameState.currentCountry.name}
Difficulty: ${gameState.difficulty.toUpperCase()}
Score: ${gameState.score}
Clues: ${cluesUsed} (${gameState.revealedClues.length}/6)
Guesses: ${guesses}/3

Can you beat my score? Play at Country Quiz!`;
  };

  const generateStatsShareText = (): string => {
    if (!achievements) {
      return 'Play Country Quiz to build your stats!';
    }

    const winRate = achievements.total_games > 0
      ? ((achievements.total_wins / achievements.total_games) * 100).toFixed(1)
      : '0.0';

    const avgClues = achievements.total_games > 0
      ? (achievements.total_clues_used / achievements.total_games).toFixed(1)
      : '0.0';

    return `My Country Quiz Stats 📊

🎮 Games Played: ${achievements.total_games}
✅ Wins: ${achievements.total_wins}
📈 Win Rate: ${winRate}%
🔥 Best Streak: ${achievements.best_streak}
⭐ Perfect Games: ${achievements.perfect_games}

🟢 Easy Wins: ${achievements.easy_wins}
🟡 Medium Wins: ${achievements.medium_wins}
🔴 Hard Wins: ${achievements.hard_wins}

💡 Avg Clues Used: ${avgClues}

Try to beat my record at Country Quiz!`;
  };

  const handleCopy = async () => {
    const text = activeTab === 'game' ? generateGameShareText() : generateStatsShareText();

    try {
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'game'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              This Game
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Overall Stats
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 min-h-[200px]">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
              {activeTab === 'game' ? generateGameShareText() : generateStatsShareText()}
            </pre>
          </div>

          <button
            onClick={handleCopy}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {navigator.share && /mobile/i.test(navigator.userAgent)
              ? 'Tap to share via your device'
              : 'Click to copy and share with friends'}
          </p>
        </div>
      </div>
    </div>
  );
}
