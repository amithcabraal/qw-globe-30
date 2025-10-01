import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { GameOverModal } from './components/GameOverModal';
import { DifficultySelection } from './components/DifficultySelection';
import { GameScreen } from './components/GameScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { MapOutlinesScreen } from './components/MapOutlinesScreen';
import { Difficulty } from './types';
import { BarChart3, Play, Map } from 'lucide-react';

type Screen = 'menu' | 'difficulty' | 'game' | 'statistics' | 'mapOutlines';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const { startNewGame, resetGame, nextRound, gameState } = useGame();
  const [initialSeedProcessed, setInitialSeedProcessed] = useState(false);

  const handleStartGame = () => {
    setCurrentScreen('difficulty');
  };

  useEffect(() => {
    if (initialSeedProcessed) return;

    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get('seed');
    const difficultyParam = urlParams.get('difficulty') as Difficulty | null;

    if (seedParam && difficultyParam) {
      const seed = parseInt(seedParam, 10);
      if (!isNaN(seed)) {
        startNewGame(difficultyParam, seed);
        setCurrentScreen('game');
        setInitialSeedProcessed(true);
      }
    } else {
      setInitialSeedProcessed(true);
    }
  }, [initialSeedProcessed, startNewGame]);

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    await startNewGame(difficulty);
    setCurrentScreen('game');
  };

  useEffect(() => {
    if (gameState.seed && currentScreen === 'game') {
      const url = new URL(window.location.href);
      url.searchParams.set('seed', gameState.seed.toString());
      url.searchParams.set('difficulty', gameState.difficulty);
      window.history.replaceState({}, '', url.toString());
    }
  }, [gameState.seed, gameState.difficulty, currentScreen]);

  const handleBackToMenu = () => {
    resetGame();
    setCurrentScreen('menu');
  };

  const handleViewStatistics = () => {
    setCurrentScreen('statistics');
  };

  const handleViewMapOutlines = () => {
    setCurrentScreen('mapOutlines');
  };

  const handlePlayAgain = async () => {
    await startNewGame(gameState.difficulty);
  };

  useEffect(() => {
    if (gameState.gameStatus !== 'playing' && currentScreen === 'game' && !gameState.showCorrectFeedback) {
      const timer = setTimeout(() => {
        setShowGameOverModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (gameState.showCorrectFeedback) {
      const timer = setTimeout(() => {
        setShowGameOverModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.showCorrectFeedback, currentScreen]);

  const handleModalPlayAgain = () => {
    setShowGameOverModal(false);
    handlePlayAgain();
  };

  const handleModalBackToMenu = () => {
    setShowGameOverModal(false);
    handleBackToMenu();
  };

  const handleNextRound = () => {
    setShowGameOverModal(false);
    nextRound();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <WelcomeModal />
      <GameOverModal
        isOpen={showGameOverModal}
        isWinner={gameState.gameStatus === 'won'}
        score={gameState.score}
        countryName={gameState.currentCountry?.name || ''}
        cluesUsed={gameState.revealedClues.length}
        guessesUsed={3 - gameState.guessesRemaining}
        roundNumber={gameState.roundNumber}
        totalRounds={gameState.totalRounds}
        roundScores={gameState.roundScores}
        roundResults={gameState.roundResults}
        seed={gameState.seed}
        difficulty={gameState.difficulty}
        onNextRound={handleNextRound}
        onPlayAgain={handleModalPlayAgain}
        onBackToMenu={handleModalBackToMenu}
      />

      {currentScreen === 'menu' && (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Country Quiz
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Test your geography knowledge with 6 exciting clues
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-xl"
              >
                <Play className="w-8 h-8" />
                Start New Game
              </button>

              <button
                onClick={handleViewStatistics}
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-6 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-xl border-2 border-gray-200 dark:border-gray-700"
              >
                <BarChart3 className="w-8 h-8" />
                View Statistics
              </button>

              <button
                onClick={handleViewMapOutlines}
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-6 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-xl border-2 border-gray-200 dark:border-gray-700"
              >
                <Map className="w-8 h-8" />
                Map Outlines
              </button>
            </div>

            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                How to Play
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <p>Click on clue cards to reveal information about the mystery country</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <p>Choose from 6 different clues: Flag, Map, Capital, Export, Fun Fact, and Region</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎲</span>
                  <p>You have 3 guesses to find the correct country</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <p>Use fewer clues and guess correctly for maximum points!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'difficulty' && (
        <DifficultySelection onSelectDifficulty={handleDifficultySelect} />
      )}

      {currentScreen === 'game' && (
        <GameScreen onBack={handleBackToMenu} />
      )}

      {currentScreen === 'statistics' && (
        <StatisticsScreen onBack={handleBackToMenu} />
      )}

      {currentScreen === 'mapOutlines' && (
        <MapOutlinesScreen onBack={handleBackToMenu} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
