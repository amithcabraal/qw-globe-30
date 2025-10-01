import React from 'react';
import { Flag, Map, MapPin, Package, Lightbulb, Globe } from 'lucide-react';
import { Country, ClueType } from '../types';
import { CountryOutline } from './CountryOutline';

interface ClueCardProps {
  type: ClueType;
  title: string;
  country: Country;
  isRevealed: boolean;
  onReveal: () => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

export function ClueCard({ type, title, country, isRevealed, onReveal, gameStatus }: ClueCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'flag':
        return <Flag className="w-6 h-6" />;
      case 'map':
        return <Map className="w-6 h-6" />;
      case 'capital':
        return <MapPin className="w-6 h-6" />;
      case 'export':
        return <Package className="w-6 h-6" />;
      case 'fact':
        return <Lightbulb className="w-6 h-6" />;
      case 'region':
        return <Globe className="w-6 h-6" />;
    }
  };

  const getContent = () => {
    switch (type) {
      case 'flag':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={country.flag}
              alt="Country flag"
              className="max-w-full max-h-full object-contain rounded shadow-lg"
            />
          </div>
        );
      case 'map':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <CountryOutline countryCode3={country.code3} countryName={country.name} />
          </div>
        );
      case 'capital':
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Capital City</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{country.capital}</p>
            </div>
          </div>
        );
      case 'export':
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Main Exports</p>
              <div className="space-y-1">
                {country.exports?.slice(0, 3).map((exp, idx) => (
                  <p key={idx} className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exp}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      case 'fact':
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Did you know?</p>
              <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                {country.funFact}
              </p>
            </div>
          </div>
        );
      case 'region':
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Region</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{country.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Population</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {country.population.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const shouldReveal = isRevealed || gameStatus !== 'playing';

  return (
    <div
      className={`relative aspect-[4/3] rounded-xl shadow-lg transition-all duration-300 ${
        shouldReveal
          ? 'bg-white dark:bg-gray-800'
          : 'bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 cursor-pointer hover:scale-105'
      }`}
      onClick={!shouldReveal ? onReveal : undefined}
    >
      {!shouldReveal ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <div className="mb-3">{getIcon()}</div>
          <h3 className="text-lg font-bold text-center">{title}</h3>
          <p className="text-sm opacity-80 mt-2">Click to reveal</p>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="text-blue-600 dark:text-blue-400">{getIcon()}</div>
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <div className="flex-1 overflow-auto">{getContent()}</div>
        </div>
      )}
    </div>
  );
}