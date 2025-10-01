import { useState } from 'react';
import { Trophy, RotateCcw, Home, Share2, Check } from 'lucide-react';
import { RoundResult } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  isWinner: boolean;
  score: number;
  countryName: string;
  cluesUsed: number;
  guessesUsed: number;
  roundNumber: number;
  totalRounds: number;
  roundScores: number[];
  roundResults: RoundResult[];
  seed: number | null;
  difficulty: string;
  onNextRound: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function GameOverModal({
  isOpen,
  isWinner,
  score,
  countryName,
  cluesUsed,
  guessesUsed,
  roundNumber,
  totalRounds,
  roundScores,
  roundResults,
  seed,
  difficulty,
  onNextRound,
  onPlayAgain,
  onBackToMenu,
}: GameOverModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isGameComplete = roundNumber >= totalRounds;
  const totalScore = [...roundScores, score].reduce((a, b) => a + b, 0);

  const generateShareText = (): string => {
    const difficultyEmoji = {
      easy: '🟢',
      medium: '🟡',
      hard: '🔴',
    }[difficulty as 'easy' | 'medium' | 'hard'] || '⚪';

    const shareUrl = seed ? `${window.location.origin}${window.location.pathname}?seed=${seed}&difficulty=${difficulty}` : '';

    const roundSummary = roundResults.map((result, index) =>
      `Round ${index + 1}: ${result.country.name} ${result.won ? '✅' : '❌'} (${result.score} pts)`
    ).join('\n');

    return `Country Quiz ${difficultyEmoji} Challenge!\n\n${roundSummary}\n\nTotal Score: ${totalScore}\n\nCan you beat my score? Play the same game:\n${shareUrl}`;
  };

  const handleShare = async () => {
    const text = generateShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Country Quiz Challenge',
          text: text,
        });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in">
        <div className="text-center">
          {isWinner ? (
            <>
              <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-bounce">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                You correctly guessed <strong className="text-green-600 dark:text-green-400">{countryName}</strong>
              </p>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Points Earned
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-500 flex justify-around text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{cluesUsed}</div>
                    <div className="text-gray-600 dark:text-gray-400">Clues Used</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{guessesUsed}</div>
                    <div className="text-gray-600 dark:text-gray-400">Guesses</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-6xl">😞</div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Game Over
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                The country was <strong className="text-red-600 dark:text-red-400">{countryName}</strong>
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Better luck next time!
                </p>
              </div>
            </>
          )}

          <div className="space-y-3">
            {roundNumber < totalRounds ? (
              <button
                onClick={onNextRound}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Next Round ({roundNumber + 1}/{totalRounds})
              </button>
            ) : (
              <>
                {isGameComplete && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Final Score</div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {totalScore}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-3 space-y-1">
                        {roundResults.map((result, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="truncate mr-2">{result.country.name}</span>
                            <span className="flex items-center gap-1">
                              {result.won ? '✅' : '❌'} {result.score} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {seed && (
                      <button
                        onClick={handleShare}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 mb-3"
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="w-5 h-5" />
                            Share Challenge
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={onPlayAgain}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
              </>
            )}
            <button
              onClick={onBackToMenu}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
