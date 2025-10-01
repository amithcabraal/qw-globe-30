import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { ClueCard } from './ClueCard';
import { GuessInput } from './GuessInput';
import { ClueType } from '../types';
import { ArrowLeft } from 'lucide-react';

interface GameScreenProps {
  onBack: () => void;
}

export function GameScreen({ onBack }: GameScreenProps) {
  const { gameState, revealClue, makeGuess } = useGame();
  const [guess, setGuess] = useState('');
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const prevGuessesRef = useRef(gameState.guessesRemaining);

  useEffect(() => {
    if (gameState.showCorrectFeedback) {
      playSuccessSound();
    } else if (
      gameState.gameStatus === 'playing' &&
      gameState.guessesRemaining < prevGuessesRef.current
    ) {
      playErrorSound();
      setShowIncorrectFeedback(true);
      setTimeout(() => setShowIncorrectFeedback(false), 1000);
    }
    prevGuessesRef.current = gameState.guessesRemaining;
  }, [gameState.guessesRemaining, gameState.gameStatus, gameState.showCorrectFeedback]);

  if (!gameState.currentCountry) {
    return null;
  }

  const handleRevealClue = (clue: ClueType) => {
    if (!gameState.revealedClues.includes(clue) && gameState.gameStatus === 'playing') {
      revealClue(clue);
    }
  };

  const handleGuess = (guessValue?: string) => {
    const finalGuess = guessValue || guess;
    if (finalGuess.trim() && gameState.gameStatus === 'playing') {
      console.log('Making guess:', finalGuess, 'for country:', gameState.currentCountry?.name);
      makeGuess(finalGuess);
      setGuess('');
    }
  };

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Play two descending tones for error
    [400, 300].forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';

      const startTime = audioContext.currentTime + (index * 0.15);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  };

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Play ascending notes for success
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  };

  const clues: { type: ClueType; title: string }[] = [
    { type: 'flag', title: 'Flag' },
    { type: 'map', title: 'Outline Map' },
    { type: 'capital', title: 'Capital City' },
    { type: 'export', title: 'Biggest Export' },
    { type: 'fact', title: 'Fun Fact' },
    { type: 'region', title: 'Region' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 relative">
      {showIncorrectFeedback && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-red-500 text-white px-8 py-6 rounded-xl shadow-2xl animate-pulse">
            <div className="text-3xl font-bold mb-2">❌ Incorrect!</div>
            <div className="text-lg">
              {gameState.guessesRemaining > 0
                ? `${gameState.guessesRemaining} guess${gameState.guessesRemaining !== 1 ? 'es' : ''} remaining`
                : 'No guesses left'}
            </div>
          </div>
        </div>
      )}

      {gameState.showCorrectFeedback && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white text-3xl font-bold px-12 py-6 rounded-xl shadow-2xl animate-bounce">
            ✅ Correct! +{gameState.score} points
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Menu</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Round:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {gameState.roundNumber}/{gameState.totalRounds}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white capitalize">
                {gameState.difficulty}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Guesses Left:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {gameState.guessesRemaining}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {clues.map((clue) => (
            <ClueCard
              key={clue.type}
              type={clue.type}
              title={clue.title}
              country={gameState.currentCountry!}
              isRevealed={gameState.revealedClues.includes(clue.type)}
              onReveal={() => handleRevealClue(clue.type)}
              gameStatus={gameState.gameStatus}
            />
          ))}
        </div>

        <GuessInput
          value={guess}
          onChange={setGuess}
          onSubmit={handleGuess}
          gameStatus={gameState.gameStatus}
          disabled={gameState.gameStatus !== 'playing'}
        />
      </div>
    </div>
  );
}
