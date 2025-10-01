import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Target, TrendingUp, Flame, Star, Award } from 'lucide-react';
import { getOrCreateUserAchievements, getRecentGames } from '../services/userService';
import { UserAchievements, GameStatistic } from '../types';

interface StatisticsScreenProps {
  onBack: () => void;
}

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [recentGames, setRecentGames] = useState<GameStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [achievementsData, gamesData] = await Promise.all([
      getOrCreateUserAchievements(),
      getRecentGames(10),
    ]);
    setAchievements(achievementsData);
    setRecentGames(gamesData);
    setIsLoading(false);
  };

  if (isLoading || !achievements) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const winRate = achievements.total_games > 0
    ? ((achievements.total_wins / achievements.total_games) * 100).toFixed(1)
    : '0.0';

  const avgClues = achievements.total_games > 0
    ? (achievements.total_clues_used / achievements.total_games).toFixed(1)
    : '0.0';

  const stats = [
    { icon: <Trophy className="w-8 h-8" />, label: 'Total Games', value: achievements.total_games, color: 'blue' },
    { icon: <Target className="w-8 h-8" />, label: 'Total Wins', value: achievements.total_wins, color: 'green' },
    { icon: <TrendingUp className="w-8 h-8" />, label: 'Win Rate', value: `${winRate}%`, color: 'purple' },
    { icon: <Flame className="w-8 h-8" />, label: 'Best Streak', value: achievements.best_streak, color: 'orange' },
    { icon: <Star className="w-8 h-8" />, label: 'Perfect Games', value: achievements.perfect_games, color: 'yellow' },
    { icon: <Award className="w-8 h-8" />, label: 'Avg Clues Used', value: avgClues, color: 'cyan' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Your Statistics
          </h1>

          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${colorMap[stat.color]} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Wins by Difficulty</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 mb-1">Easy</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{achievements.easy_wins}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Medium</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{achievements.medium_wins}</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 mb-1">Hard</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{achievements.hard_wins}</p>
            </div>
          </div>
        </div>

        {recentGames.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Games</h2>
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    game.won
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{game.country_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} •
                        {game.clues_used} clues • {game.guesses_made} guesses
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        game.won
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {game.won ? game.score : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentGames.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No games played yet</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Start playing to build your statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
}
