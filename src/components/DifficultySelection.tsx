import React from 'react';
import { Trophy, Target, Flame } from 'lucide-react';
import { Difficulty } from '../types';

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export function DifficultySelection({ onSelectDifficulty }: DifficultySelectionProps) {
  const difficulties = [
    {
      level: 'easy' as Difficulty,
      title: 'Easy',
      icon: <Trophy className="w-12 h-12" />,
      description: '30 most populous countries',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      level: 'medium' as Difficulty,
      title: 'Medium',
      icon: <Target className="w-12 h-12" />,
      description: 'Next 50 largest countries',
      color: 'from-yellow-500 to-orange-600',
      hoverColor: 'hover:from-yellow-600 hover:to-orange-700',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      level: 'hard' as Difficulty,
      title: 'Hard',
      icon: <Flame className="w-12 h-12" />,
      description: '120 countries worldwide',
      color: 'from-red-500 to-rose-600',
      hoverColor: 'hover:from-red-600 hover:to-rose-700',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Challenge
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select a difficulty level to begin your geography adventure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.level}
              onClick={() => onSelectDifficulty(difficulty.level)}
              className={`group relative ${difficulty.bgColor} ${difficulty.borderColor} border-2 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`bg-gradient-to-br ${difficulty.color} ${difficulty.hoverColor} text-white p-6 rounded-full transition-all duration-300 group-hover:rotate-12`}>
                  {difficulty.icon}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {difficulty.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {difficulty.description}
                  </p>
                </div>

                <div className={`w-full bg-gradient-to-r ${difficulty.color} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0`}>
                  Start Playing
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/20 dark:from-white/0 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🎯</span>
                <p>6 different clues to help you guess</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🎲</span>
                <p>3 attempts to find the country</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">⭐</span>
                <p>Fewer clues means higher score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
