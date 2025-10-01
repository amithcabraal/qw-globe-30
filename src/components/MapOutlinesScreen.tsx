import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { CountryOutline } from './CountryOutline';

interface MapOutlinesScreenProps {
  onBack: () => void;
}

export function MapOutlinesScreen({ onBack }: MapOutlinesScreenProps) {
  const { allCountries } = useGame();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = allCountries
    .filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Menu</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Map Outlines
          </h1>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country) => (
            <div
              key={country.code}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <CountryOutline
                  countryCode3={country.code3}
                  countryName={country.name}
                />
              </div>
              <div className="p-4 border-t-2 border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                  {country.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {country.code}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No countries found matching "{searchTerm}"
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCountries.length} of {allCountries.length} countries
        </div>
      </div>
    </div>
  );
}
