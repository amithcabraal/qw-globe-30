import React from 'react';
import { X, Flag, Map, MapPin, Package, Lightbulb, Globe } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const clues = [
    { icon: <Flag className="w-5 h-5" />, name: 'Flag', description: 'The national flag of the country' },
    { icon: <Map className="w-5 h-5" />, name: 'Outline Map', description: 'The geographical shape of the country' },
    { icon: <MapPin className="w-5 h-5" />, name: 'Capital', description: 'The capital city' },
    { icon: <Package className="w-5 h-5" />, name: 'Biggest Export', description: 'Main products the country exports' },
    { icon: <Lightbulb className="w-5 h-5" />, name: 'Fun Fact', description: 'An interesting fact about the country' },
    { icon: <Globe className="w-5 h-5" />, name: 'Region', description: 'The geographical region and population' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Instructions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Play</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>1. Select a difficulty level to begin</p>
              <p>2. Click on clue cards to reveal information about the mystery country</p>
              <p>3. Type your guess in the input field and press Enter or click Guess</p>
              <p>4. You have 3 attempts to guess correctly</p>
              <p>5. Try to use as few clues as possible for a higher score!</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Available Clues</h3>
            <div className="grid gap-3">
              {clues.map((clue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                    {clue.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{clue.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{clue.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Difficulty Levels</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
                <h4 className="font-semibold text-green-900 dark:text-green-300">Easy</h4>
                <p className="text-sm text-green-700 dark:text-green-400">30 most populous countries in the world</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-600">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-300">Medium</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">The next 50 largest countries by population</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-600">
                <h4 className="font-semibold text-red-900 dark:text-red-300">Hard</h4>
                <p className="text-sm text-red-700 dark:text-red-400">120 countries from around the globe</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Scoring</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2 text-gray-700 dark:text-gray-300">
              <p>Base score: <strong>1000 points</strong></p>
              <p>Each clue revealed: <strong>-100 points</strong></p>
              <p>Each incorrect guess: <strong>-150 points</strong></p>
              <p className="pt-2 text-blue-700 dark:text-blue-300 font-semibold">
                Perfect game (1 clue, 1 guess): 900 points!
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tips</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>Start with clues that give you broad information (like region or fun facts)</li>
              <li>Save the flag and map for when you've narrowed down possibilities</li>
              <li>Track your statistics to see your improvement over time</li>
              <li>Challenge yourself to improve your average clues used!</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
