import React, { createContext, useContext, useState, useCallback } from 'react';
import { Country, Difficulty, GameState, ClueType, RoundResult } from '../types';
import { getCountriesByDifficulty, fetchCountries } from '../services/countriesApi';
import { recordGameStatistic } from '../services/userService';
import { generateSeed, selectRandomItems } from '../utils/seededRandom';

interface GameContextType {
  gameState: GameState;
  allCountries: Country[];
  startNewGame: (difficulty: Difficulty, seed?: number) => Promise<void>;
  revealClue: (clue: ClueType) => void;
  makeGuess: (guess: string) => void;
  giveUp: () => void;
  nextRound: () => void;
  resetGame: () => void;
  isLoading: boolean;
}

const initialGameState: GameState = {
  currentCountry: null,
  difficulty: 'easy',
  revealedClues: [],
  guessesRemaining: 3,
  gameStatus: 'playing',
  score: 0,
  roundNumber: 1,
  totalRounds: 5,
  roundScores: [],
  showCorrectFeedback: false,
  seed: null,
  selectedCountries: [],
  roundResults: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        const countries = await fetchCountries();
        setAllCountries(countries);
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    if (allCountries.length === 0) {
      loadCountries();
    }
  }, []);

  const calculateScore = useCallback((cluesUsed: number, guessesRemaining: number): number => {
    const baseScore = 1000;
    const cluesPenalty = cluesUsed * 100;
    const guessesPenalty = (3 - guessesRemaining) * 150;
    return Math.max(0, baseScore - cluesPenalty - guessesPenalty);
  }, []);

  const startNewGame = useCallback(async (difficulty: Difficulty, seed?: number) => {
    setIsLoading(true);
    try {
      let countries = allCountries;
      if (countries.length === 0) {
        countries = await fetchCountries();
        setAllCountries(countries);
      }

      const gameSeed = seed || generateSeed();
      const difficultyCountries = getCountriesByDifficulty(countries, difficulty);
      const selectedCountries = selectRandomItems(difficultyCountries, 5, gameSeed);

      setGameState({
        currentCountry: selectedCountries[0],
        difficulty,
        revealedClues: [],
        guessesRemaining: 3,
        gameStatus: 'playing',
        score: 0,
        roundNumber: 1,
        totalRounds: 5,
        roundScores: [],
        showCorrectFeedback: false,
        seed: gameSeed,
        selectedCountries,
        roundResults: [],
      });
    } catch (error) {
      console.error('Error starting new game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [allCountries]);

  const revealClue = useCallback((clue: ClueType) => {
    setGameState(prev => {
      if (prev.revealedClues.includes(clue)) {
        return prev;
      }
      return {
        ...prev,
        revealedClues: [...prev.revealedClues, clue],
      };
    });
  }, []);

  const makeGuess = useCallback((guess: string) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || !prev.currentCountry) {
        return prev;
      }

      const normalizedGuess = guess.toLowerCase().trim();
      const normalizedCountry = prev.currentCountry.name.toLowerCase().trim();

      console.log('Guess comparison:', {
        guess: normalizedGuess,
        country: normalizedCountry,
        match: normalizedGuess === normalizedCountry
      });

      const isCorrect = normalizedGuess === normalizedCountry;
      const newGuessesRemaining = prev.guessesRemaining - 1;

      let newStatus: 'playing' | 'won' | 'lost' = prev.gameStatus;
      let newScore = prev.score;

      if (isCorrect) {
        newStatus = 'won';
        newScore = calculateScore(prev.revealedClues.length, newGuessesRemaining);

        recordGameStatistic(
          prev.currentCountry.name,
          prev.difficulty,
          prev.revealedClues.length,
          3 - newGuessesRemaining,
          true,
          newScore,
          prev.revealedClues
        );

        const roundResult: RoundResult = {
          country: prev.currentCountry,
          won: true,
          score: newScore,
          cluesUsed: prev.revealedClues.length,
          guessesUsed: 3 - newGuessesRemaining,
        };

        return {
          ...prev,
          guessesRemaining: newGuessesRemaining,
          gameStatus: newStatus,
          score: newScore,
          showCorrectFeedback: true,
          roundResults: [...prev.roundResults, roundResult],
        };
      } else if (newGuessesRemaining === 0) {
        newStatus = 'lost';
        newScore = 0;

        recordGameStatistic(
          prev.currentCountry.name,
          prev.difficulty,
          prev.revealedClues.length,
          3,
          false,
          0,
          prev.revealedClues
        );

        const roundResult: RoundResult = {
          country: prev.currentCountry,
          won: false,
          score: 0,
          cluesUsed: prev.revealedClues.length,
          guessesUsed: 3,
        };

        return {
          ...prev,
          guessesRemaining: newGuessesRemaining,
          gameStatus: newStatus,
          score: newScore,
          showCorrectFeedback: false,
          roundResults: [...prev.roundResults, roundResult],
        };
      }

      return {
        ...prev,
        guessesRemaining: newGuessesRemaining,
        gameStatus: newStatus,
        score: newScore,
      };
    });
  }, [calculateScore]);

  const giveUp = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || !prev.currentCountry) {
        return prev;
      }

      recordGameStatistic(
        prev.currentCountry.name,
        prev.difficulty,
        prev.revealedClues.length,
        3 - prev.guessesRemaining,
        false,
        0,
        prev.revealedClues
      );

      const roundResult: RoundResult = {
        country: prev.currentCountry,
        won: false,
        score: 0,
        cluesUsed: prev.revealedClues.length,
        guessesUsed: 3 - prev.guessesRemaining,
      };

      return {
        ...prev,
        guessesRemaining: 0,
        gameStatus: 'lost',
        score: 0,
        showCorrectFeedback: false,
        roundResults: [...prev.roundResults, roundResult],
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const newRoundScores = [...prev.roundScores, prev.score];
      const nextRoundNum = prev.roundNumber + 1;

      if (nextRoundNum > prev.totalRounds || nextRoundNum > prev.selectedCountries.length) {
        return prev;
      }

      const nextCountry = prev.selectedCountries[nextRoundNum - 1];

      return {
        ...prev,
        currentCountry: nextCountry,
        revealedClues: [],
        guessesRemaining: 3,
        gameStatus: 'playing',
        score: 0,
        roundNumber: nextRoundNum,
        roundScores: newRoundScores,
        showCorrectFeedback: false,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, allCountries, startNewGame, revealClue, makeGuess, giveUp, nextRound, resetGame, isLoading }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
